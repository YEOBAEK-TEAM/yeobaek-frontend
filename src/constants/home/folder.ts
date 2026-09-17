import BeigeFolder from "@/assets/images/home/BeigeFolder.png";
import GreenFolder from "@/assets/images/home/GreenFolder.png";

export type FolderTone = "reading" | "report";

export const FOLDER_IMAGE: Record<FolderTone, string> = {
  reading: BeigeFolder,
  report: GreenFolder,
};

// 폴더 이미지 원본 비율
export const FOLDER_ASPECT_RATIO = "1408 / 608";

// 이미지에서 탭 아래 본문이 시작하는 높이
export const FOLDER_BODY_TOP = "17.6%";

// 이미지의 탭 위치에 맞춘 클릭 영역
export const FOLDER_TAB_AREA: Record<FolderTone, string> = {
  reading: "left-0 w-[29%]",
  report: "left-[29%] w-[31%]",
};
