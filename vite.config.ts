import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, normalizePath } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

const require = createRequire(import.meta.url);

const pdfjsDistPath = path.dirname(require.resolve("pdfjs-dist/package.json"));

const wasmDir = normalizePath(path.join(pdfjsDistPath, "wasm"));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    viteStaticCopy({
      targets: [
        {
          src: wasmDir,
          dest: "",
        },
      ],
    }),
  ],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  // sockjs-client가 브라우저에 없는 global을 참조
  define: {
    global: "globalThis",
  },
});
