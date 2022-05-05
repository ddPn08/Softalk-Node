import { defineConfig } from "tsup"

export default defineConfig({
  entryPoints: ["src/*.ts"],
  target: "node16",
  format: ["esm", 'cjs'],
  clean: true,
  minify: false,
  dts: true,
  bundle: false,
  skipNodeModulesBundle: true,
  splitting: false,
})
