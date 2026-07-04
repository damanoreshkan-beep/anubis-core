// jsdom exposes `document` globally under vitest but not always
// `localStorage`. rates + the caches use the bare `localStorage` global,
// so guarantee it exists: prefer jsdom's window storage, else a minimal
// in-memory shim.
if (typeof globalThis.localStorage === 'undefined') {
    const fromWindow = typeof window !== 'undefined' ? window.localStorage : undefined
    if (fromWindow) {
        globalThis.localStorage = fromWindow
    } else {
        const store = new Map<string, string>()
        globalThis.localStorage = {
            getItem: k => (store.has(k) ? store.get(k)! : null),
            setItem: (k, v) => void store.set(k, String(v)),
            removeItem: k => void store.delete(k),
            clear: () => store.clear(),
            key: i => [...store.keys()][i] ?? null,
            get length() {
                return store.size
            },
        } as Storage
    }
}
