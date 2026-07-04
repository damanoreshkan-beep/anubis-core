// Locale picker shared by every widget's `copyFor`. Each widget keeps its
// own COPY object (2-char locale keys); this just selects the block with an
// `en` fallback. Replaces the identical helper copied into each widget.

export function pickLocale<C extends Record<string, unknown>>(
    copy: C,
    lang: string | undefined | null,
    fallback: keyof C = 'en' as keyof C,
): C[keyof C] {
    const key = (lang || '').slice(0, 2).toLowerCase() as keyof C
    return (copy[key] ?? copy[fallback]) as C[keyof C]
}
