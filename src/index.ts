// @anubis/widget-core — shared runtime for Anubis World widgets.
// Visual layer lives in @anubis/ds; this is the logic layer.
export { readCachedRates, isFresh, fetchRates, type Rates } from './rates'
export { pickLocale } from './i18n'
export { obtainSharedClient } from './supabase'
