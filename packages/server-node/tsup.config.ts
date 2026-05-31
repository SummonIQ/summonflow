import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/host.ts", "src/embedded.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  target: "es2020",
});
