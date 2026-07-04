import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { resolve } from 'node:path'

// Shared Vite library config for Anubis web-component widgets. Each widget
// builds src/lib.tsx → a single ES bundle with CSS inlined, so consumers
// ship one <script type="module"> tag. preact/compat aliases let shadcn/@anubis/ds
// React components run under Preact.
//
// Widget vite.config.ts:
//   import { widgetVite } from '@anubis/core/vite-preset'
//   export default widgetVite({ dir: import.meta.dirname, fileName: 'anubis-<name>.js' })
export function widgetVite({ dir, fileName, assetsInlineLimit = 64 * 1024 }) {
    return defineConfig(({ command }) => ({
        plugins: [preact()],
        resolve: {
            alias: {
                react: 'preact/compat',
                'react-dom': 'preact/compat',
                'react/jsx-runtime': 'preact/jsx-runtime',
            },
            dedupe: ['preact'],
        },
        define: {
            'process.env.NODE_ENV': JSON.stringify(command === 'build' ? 'production' : 'development'),
        },
        build: {
            lib: {
                entry: resolve(dir, 'src/lib.tsx'),
                formats: ['es'],
                fileName: () => fileName,
            },
            cssCodeSplit: false,
            rollupOptions: { output: { inlineDynamicImports: true } },
            outDir: 'dist',
            emptyOutDir: true,
            target: 'es2022',
            // Inline small assets (e.g. QR JPGs) as base64 so the widget ships
            // as a single file — no extra fetches. Raise per widget if needed.
            assetsInlineLimit,
        },
    }))
}
