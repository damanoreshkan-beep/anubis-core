# @anubis/widget-core

Shared **runtime** for Anubis World web-component widgets (payments, cabinet,
auth, reviews, download). Pairs with [`@anubis/ds`](https://github.com/damanoreshkan-beep/anubis-ds)
— `ds` is the visual layer (Tailwind preset, `cn`, components), `widget-core`
is the logic layer.

Extracted to kill cross-widget duplication (each widget used to copy these).

## Exports

- `readCachedRates()` / `isFresh()` / `fetchRates()` / `Rates` — UAH→USD/RUB FX
  with a 24h localStorage cache.
- `pickLocale(copy, lang, fallback?)` — generic locale selector for a widget's
  `COPY` object (2-char keys, `en` fallback).

## Consuming

```jsonc
// widget package.json
"dependencies": {
  "@anubis/widget-core": "github:damanoreshkan-beep/anubis-widget-core"
}
```

```ts
import { fetchRates, readCachedRates, isFresh, pickLocale } from '@anubis/widget-core'
```

`dist/` is committed so consumers install straight from GitHub without a build
step (same convention as `@anubis/ds`). Rebuild with `npm run build`.
