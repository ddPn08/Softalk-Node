import { build } from 'esbuild'

/** @type {import('esbuild').BuildOptions} */
const option = {
    logLevel: 'info',
    entryPoints: ['./src/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'esnext',
}

await build({
    ...option,
    format: 'cjs',
    outfile: './dist/index.js',
})
await build({
    ...option,
    format: 'esm',
    outfile: './dist/index.mjs',
})
