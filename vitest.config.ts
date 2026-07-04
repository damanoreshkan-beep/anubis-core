import { defineConfig } from 'vitest/config'

// jsdom gives the tests document / CustomEvent / localStorage — the DOM
// surface obtainSharedClient and the caches coordinate through.
export default defineConfig({
    test: {
        environment: 'jsdom',
        // A real origin (not about:blank) so jsdom enables window.localStorage,
        // which rates + the caches read/write.
        environmentOptions: { jsdom: { url: 'http://localhost/' } },
        setupFiles: ['./test/setup.ts'],
        include: ['test/**/*.test.ts'],
    },
})
