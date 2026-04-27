import { reactRouter } from "@react-router/dev/vite";
import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import type { Plugin } from "vite";

function wasmExternalPlugin(): Plugin {
  return {
    name: "wasm-external",
    enforce: "pre",
    resolveId(id) {
      if (id.endsWith(".wasm")) {
        return { id, external: true };
      }
    },
  };
}

export default defineConfig({
  base: "/iphone-cost/",
  plugins: [
    cloudflareDevProxy(),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    wasmExternalPlugin(),
  ],
});
