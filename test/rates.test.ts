import { describe, it, expect, vi, afterEach } from 'vitest'
import { readCachedRates, isFresh, fetchRates } from '../src/rates'

const KEY = 'aw-payments-rates'

afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
})

describe('isFresh', () => {
    it('is false for a null cache', () => {
        expect(isFresh(null)).toBe(false)
    })
    it('is true within the 24h TTL', () => {
        expect(isFresh({ USD: 0.024, RUB: 2.2, fetchedAt: Date.now() })).toBe(true)
    })
    it('is false once older than the TTL', () => {
        expect(isFresh({ USD: 0.024, RUB: 2.2, fetchedAt: Date.now() - 25 * 60 * 60 * 1000 })).toBe(false)
    })
})

describe('readCachedRates', () => {
    it('returns null when nothing is cached', () => {
        expect(readCachedRates()).toBeNull()
    })
    it('returns null on malformed JSON', () => {
        localStorage.setItem(KEY, '{ not json')
        expect(readCachedRates()).toBeNull()
    })
    it('returns null when USD/RUB are not numbers', () => {
        localStorage.setItem(KEY, JSON.stringify({ USD: 'x', RUB: 1, fetchedAt: 0 }))
        expect(readCachedRates()).toBeNull()
    })
    it('returns the cached rates when valid', () => {
        const r = { USD: 0.024, RUB: 2.2, fetchedAt: 123 }
        localStorage.setItem(KEY, JSON.stringify(r))
        expect(readCachedRates()).toEqual(r)
    })
})

describe('fetchRates', () => {
    const ok = (body: unknown) =>
        vi.fn(async () => new Response(JSON.stringify(body), { status: 200 }))

    it('parses UAH rates, caches them and returns USD/RUB', async () => {
        globalThis.fetch = ok({ result: 'success', rates: { USD: 0.024, RUB: 2.2 } }) as typeof fetch
        const r = await fetchRates()
        expect(r.USD).toBe(0.024)
        expect(r.RUB).toBe(2.2)
        expect(typeof r.fetchedAt).toBe('number')
        // side-effect: it wrote the shared cache
        expect(readCachedRates()).toMatchObject({ USD: 0.024, RUB: 2.2 })
    })

    it('throws on an HTTP error', async () => {
        globalThis.fetch = vi.fn(async () => new Response('', { status: 500 })) as typeof fetch
        await expect(fetchRates()).rejects.toThrow(/rates http 500/)
    })

    it('throws when the API reports a non-success result', async () => {
        globalThis.fetch = ok({ result: 'error' }) as typeof fetch
        await expect(fetchRates()).rejects.toThrow(/rates api failure/)
    })

    it('throws when USD or RUB is missing', async () => {
        globalThis.fetch = ok({ result: 'success', rates: { USD: 0.024 } }) as typeof fetch
        await expect(fetchRates()).rejects.toThrow(/missing USD\/RUB/)
    })
})
