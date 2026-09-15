import { pdfjs } from "react-pdf";
import type { PDFPageProxy } from "pdfjs-dist";

type ImageResource = {
  width: number;
  height: number;
  kind?: number;
  data?: Uint8Array | Uint8ClampedArray;
  bitmap?: ImageBitmap;
};
type ImageAsset = { src: string; width: number; height: number };
type Matrix = [number, number, number, number, number, number];
export type PositionedPdfImage = ImageAsset & {
  id: string;
  x: number;
  y: number;
  placedWidth: number;
};
const identity: Matrix = [1, 0, 0, 1, 0, 0];
const multiply = (a: Matrix, b: Matrix) => pdfjs.Util.transform(a, b) as Matrix;

// One owner per loaded document: cache repeated resources and revoke on unmount.
export class PdfImageResources {
  private cache = new Map<string, Promise<ImageAsset>>();
  private urls = new Set<string>();
  private disposed = false;

  dispose() {
    this.disposed = true;
    this.urls.forEach((url) => URL.revokeObjectURL(url));
    this.urls.clear();
    this.cache.clear();
  }

  get(page: PDFPageProxy, id: string) {
    let asset = this.cache.get(id);
    if (!asset) {
      asset = new Promise<ImageResource>((resolve, reject) => {
        const timeout = window.setTimeout(
          () => reject(new Error(`PDF 이미지 로딩 시간 초과: ${id}`)),
          15000,
        );
        try {
          (id.startsWith("g_") ? page.commonObjs : page.objs).get(
            id,
            (value: ImageResource | null) => {
              window.clearTimeout(timeout);
              if (value) resolve(value);
              else reject(new Error(`PDF 이미지를 해독하지 못했습니다: ${id}`));
            },
          );
        } catch (error) {
          window.clearTimeout(timeout);
          reject(error);
        }
      }).then((resource) => this.encode(resource));
      this.cache.set(id, asset);
      void asset.catch(() => this.cache.delete(id));
    }
    return asset;
  }

  async encode(
    resource: ImageResource,
    crop?: { x: number; y: number; w: number; h: number },
  ): Promise<ImageAsset> {
    if (this.disposed) throw new Error("PDF 이미지 로딩이 취소되었습니다.");
    const { width, height, data, bitmap, kind } = resource;
    if (!(width > 0 && height > 0)) throw new Error("PDF 이미지 크기가 올바르지 않습니다.");
    // This detached canvas encodes only the embedded image resource, never a PDF page.
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("이미지 변환을 시작하지 못했습니다.");
    if (bitmap) context.drawImage(bitmap, 0, 0);
    else if (data) {
      const pixels = context.createImageData(width, height);
      if (kind === pdfjs.ImageKind.RGBA_32BPP) pixels.data.set(data);
      else if (kind === pdfjs.ImageKind.RGB_24BPP) {
        for (let i = 0; i < width * height; i++) {
          pixels.data[i * 4] = data[i * 3];
          pixels.data[i * 4 + 1] = data[i * 3 + 1];
          pixels.data[i * 4 + 2] = data[i * 3 + 2];
          pixels.data[i * 4 + 3] = 255;
        }
      } else if (kind === pdfjs.ImageKind.GRAYSCALE_1BPP) {
        const stride = Math.ceil(width / 8);
        for (let y = 0; y < height; y++)
          for (let x = 0; x < width; x++) {
            const value = data[y * stride + (x >> 3)] & (128 >> (x % 8)) ? 255 : 0;
            const index = (y * width + x) * 4;
            pixels.data.set([value, value, value, 255], index);
          }
      } else throw new Error(`지원하지 않는 PDF 이미지 픽셀 형식: ${kind}`);
      context.putImageData(pixels, 0, 0);
    } else throw new Error("PDF 이미지 픽셀을 가져오지 못했습니다.");
    let output = canvas;
    if (crop) {
      output = document.createElement("canvas");
      output.width = crop.w;
      output.height = crop.h;
      output
        .getContext("2d")
        ?.drawImage(canvas, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
    }
    try {
      const blob = await new Promise<Blob>((resolve, reject) =>
        output.toBlob(
          (value) => (value ? resolve(value) : reject(new Error("이미지 변환에 실패했습니다."))),
          "image/png",
        ),
      );
      if (this.disposed) throw new Error("PDF 이미지 로딩이 취소되었습니다.");
      const src = URL.createObjectURL(blob);
      this.urls.add(src);
      return { src, width: output.width, height: output.height };
    } finally {
      canvas.width = canvas.height = 0;
      if (output !== canvas) output.width = output.height = 0;
    }
  }
}

export async function extractPdfPageImages(
  page: PDFPageProxy,
  resources: PdfImageResources,
): Promise<PositionedPdfImage[]> {
  const operators = await page.getOperatorList();
  const { OPS } = pdfjs;
  let matrix: Matrix = [...identity];
  const stack: Matrix[] = [];
  const images: Promise<PositionedPdfImage>[] = [];
  const add = (asset: Promise<ImageAsset>, transform: Matrix, id: string) => {
    const [a, b, c, d, e, f] = transform;
    images.push(
      asset.then((image) => ({
        ...image,
        id,
        x: Math.min(e, e + a, e + c, e + a + c),
        y: Math.max(f, f + b, f + d, f + b + d),
        placedWidth: Math.hypot(a, b),
      })),
    );
  };
  for (let i = 0; i < operators.fnArray.length; i++) {
    const op = operators.fnArray[i];
    const args = operators.argsArray[i];
    const id = `image:${page.pageNumber}:${i}`;
    if (op === OPS.save) stack.push([...matrix]);
    else if (op === OPS.restore || op === OPS.paintFormXObjectEnd || op === OPS.endGroup)
      matrix = stack.pop() ?? [...identity];
    else if (op === OPS.transform) matrix = multiply(matrix, args as Matrix);
    else if (op === OPS.paintFormXObjectBegin || op === OPS.beginGroup) {
      stack.push([...matrix]);
      const transform = op === OPS.beginGroup ? args[0].matrix : args[0];
      if (transform) matrix = multiply(matrix, transform);
    } else if (op === OPS.paintImageXObject) add(resources.get(page, args[0]), matrix, id);
    else if (op === OPS.paintInlineImageXObject) add(resources.encode(args[0]), matrix, id);
    else if (op === OPS.paintImageXObjectRepeat) {
      const [resourceId, sx, sy, positions] = args;
      for (let j = 0; j < positions.length; j += 2)
        add(
          resources.get(page, resourceId),
          multiply(matrix, [sx, 0, 0, sy, positions[j], positions[j + 1]]),
          `${id}:${j}`,
        );
    } else if (op === OPS.paintInlineImageXObjectGroup) {
      const [resource, placements] = args;
      placements.forEach(
        (placement: { transform: Matrix; x: number; y: number; w: number; h: number }, j: number) =>
          add(
            resources.encode(resource, placement),
            multiply(matrix, placement.transform),
            `${id}:${j}`,
          ),
      );
    }
  }
  return Promise.all(images);
}
