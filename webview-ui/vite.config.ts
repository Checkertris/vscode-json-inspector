import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~": "/src",
    },
  },
  build: {
    outDir: "build",

    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./src/main/index.tsx", import.meta.url)),
      },
      output: {
        entryFileNames: `views/[name].js`,
        chunkFileNames: `views/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
});
