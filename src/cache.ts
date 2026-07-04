// Stale-while-revalidate resource loader for the widgets.
//
// Reviews and Download independently grew the same shape: seed state
// from a localStorage cache for an instant first paint, fetch in the
// background, re-fetch when the tab regains focus, and only surface an
// error when there is no cached data to fall back on. This centralises
// that pattern (and its subtleties — the cancelled guard, the
// visibility listener, the error-suppression rule) so a fix lands once.
import { useEffect, useState } from 'preact/hooks'

/** Read + JSON.parse a cache entry. SSR-safe, never throws. Pass
 *  `parse` to validate/narrow the raw value — return null to reject a
 *  stale or wrong-shaped entry (e.g. an old cache format). */
function readCache<T>(key: string, parse?: (raw: unknown) => T | null): T | null {
    if (typeof localStorage === 'undefined') return null
    try {
        const raw = localStorage.getItem(key)
        if (!raw) return null
        const data = JSON.parse(raw) as unknown
        return parse ? parse(data) : (data as T)
    } catch {
        return null
    }
}

/** Write a cache entry. SSR-safe, swallows quota / private-mode errors. */
function writeCache<T>(key: string, value: T): void {
    if (typeof localStorage === 'undefined') return
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch {
        /* quota exceeded / private mode — cache is best-effort */
    }
}

export interface CachedResource<T> {
    data: T | null
    loading: boolean
    error: string | null
}

/**
 * Load a resource with stale-while-revalidate semantics.
 *
 * @param key   localStorage key, or `null` to disable (missing props) —
 *              leaves `data` null and `loading` false.
 * @param fetcher  fresh-data fetch, re-run on mount, on `deps` change,
 *              and whenever the tab becomes visible again.
 * @param deps  effect dependencies (same contract as useEffect).
 * @param parse optional validator for a cached raw value.
 */
export function useCachedResource<T>(
    key: string | null,
    fetcher: () => Promise<T>,
    deps: readonly unknown[] = [],
    parse?: (raw: unknown) => T | null,
): CachedResource<T> {
    const [data, setData] = useState<T | null>(() => (key ? readCache<T>(key, parse) : null))
    const [loading, setLoading] = useState<boolean>(data === null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!key) {
            setLoading(false)
            return
        }
        const cached = readCache<T>(key, parse)
        if (cached !== null) {
            setData(cached)
            setLoading(false)
        }

        let cancelled = false
        const run = () =>
            fetcher()
                .then(v => {
                    if (cancelled) return
                    writeCache(key, v)
                    setData(v)
                    setError(null)
                })
                .catch(e => {
                    if (cancelled) return
                    // Keep showing stale data on a failed revalidation;
                    // only report the error on a cold cache.
                    if (cached === null) setError(String((e as Error)?.message ?? e))
                })
                .finally(() => {
                    if (!cancelled) setLoading(false)
                })
        run()

        const onVisible = () => {
            if (document.visibilityState === 'visible') run()
        }
        document.addEventListener('visibilitychange', onVisible)
        return () => {
            cancelled = true
            document.removeEventListener('visibilitychange', onVisible)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)

    return { data, loading, error }
}
