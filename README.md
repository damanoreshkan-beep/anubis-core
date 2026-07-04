# @anubis/core

Shared **runtime + build presets** for Anubis World web-component widgets
(payments, cabinet, auth, reviews, download). Pairs with
[`@anubis/ds`](https://github.com/damanoreshkan-beep/anubis-ds) — `ds` is the
visual layer (Tailwind preset, `cn`, components, `scope-globals`), `core` is
the logic + widget-build layer.

Extracted to kill cross-widget duplication (each widget used to copy these).

## Exports

- `@anubis/core` — runtime:
  - `readCachedRates()` / `isFresh()` / `fetchRates()` / `Rates` — UAH→USD/RUB FX (24h cache).
  - `pickLocale(copy, lang, fallback?)` — locale selector for a widget's `COPY`.
  - `obtainSharedClient(url?, key?)` — one Supabase client per page (via `anubis-need-supabase`).
- `@anubis/core/vite-preset` — `widgetVite({ dir, fileName, assetsInlineLimit? })`
  shared Vite library config (preact/compat, single-file ES bundle).

## Consuming

```jsonc
// widget package.json
"dependencies": {
  "@anubis/core": "github:damanoreshkan-beep/anubis-core"
}
```

```ts
import { fetchRates, pickLocale, obtainSharedClient } from '@anubis/core'
```

```ts
// vite.config.ts
import { widgetVite } from '@anubis/core/vite-preset'
export default widgetVite({ dir: import.meta.dirname, fileName: 'anubis-<name>.js' })
```

`dist/` is committed so consumers install straight from GitHub without a build
step (same convention as `@anubis/ds`). Rebuild with `npm run build`.
