export interface CachedResource<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
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
export declare function useCachedResource<T>(key: string | null, fetcher: () => Promise<T>, deps?: readonly unknown[], parse?: (raw: unknown) => T | null): CachedResource<T>;
