import { describe, it, expect } from 'vitest'
import { pickLocale } from '../src/i18n'

const COPY = {
    en: { hi: 'hello' },
    uk: { hi: 'привіт' },
    ru: { hi: 'привет' },
}

describe('pickLocale', () => {
    it('selects the block by the 2-char, lower-cased code', () => {
        expect(pickLocale(COPY, 'uk_UA')).toBe(COPY.uk)
        expect(pickLocale(COPY, 'EN')).toBe(COPY.en)
    })

    it('falls back to en for unknown / empty / nullish lang', () => {
        expect(pickLocale(COPY, 'de')).toBe(COPY.en)
        expect(pickLocale(COPY, '')).toBe(COPY.en)
        expect(pickLocale(COPY, undefined)).toBe(COPY.en)
        expect(pickLocale(COPY, null)).toBe(COPY.en)
    })

    it('honours a custom fallback', () => {
        expect(pickLocale(COPY, 'zz', 'ru')).toBe(COPY.ru)
    })
})
