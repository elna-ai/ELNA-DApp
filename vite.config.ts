/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import environment from "vite-plugin-environment";
import path from "path";
import dotenv from "dotenv";
import svgr from "vite-plugin-svgr";

dotenv.config();

export default defineConfig(({ mode }) => {
  dotenv.config({ path: `./.env.${mode}` });

  return {
    root: "src",
    build: {
      outDir: "../dist",
      emptyOutDir: true,
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "http://127.0.0.1:4943",
          changeOrigin: true,
        },
      },
    },
    plugins: [
      react(),
      environment("all", { prefix: "CANISTER_" }),
      environment("all", { prefix: "DFX_" }),
      environment({ BACKEND_CANISTER_ID: "" }),
      svgr(),
    ],
    resolve: {
      alias: {
        apis: path.resolve("./src/apis"),
        components: path.resolve("./src/components"),
        common: path.resolve("./src/common"),
        translations: path.resolve("./src/translations"),
        stylesheets: path.resolve("./src/stylesheets"),
        "elna-ui": path.resolve("./src/components/elna-ui"),
        hooks: path.resolve("./src/hooks"),
        images: path.resolve("./src/images"),
        stores: path.resolve("./src/stores"),
        types: path.resolve("./src/types.ts"),
        declarations: path.resolve("./src/declarations"),
        utils: path.resolve("./src/utils"),
        src: path.resolve("./src/"),
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: "setupTests.ts",
      cache: { dir: "../node_modules/.vitest" },
    },
  };
});
