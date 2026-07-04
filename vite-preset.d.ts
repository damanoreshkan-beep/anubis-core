import type { UserConfigExport } from 'vite'

export interface WidgetViteOptions {
    /** Widget package dir — pass `import.meta.dirname`. */
    dir: string
    /** Output bundle filename, e.g. `'anubis-payments.js'`. */
    fileName: string
    /** Byte threshold below which assets inline as base64. Default 64 KiB. */
    assetsInlineLimit?: number
}

export function widgetVite(opts: WidgetViteOptions): UserConfigExport
