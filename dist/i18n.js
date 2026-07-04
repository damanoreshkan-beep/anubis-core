// Locale picker shared by every widget's `copyFor`. Each widget keeps its
// own COPY object (2-char locale keys); this just selects the block with an
// `en` fallback. Replaces the identical helper copied into each widget.
export function pickLocale(copy, lang, fallback = 'en') {
    const key = (lang || '').slice(0, 2).toLowerCase();
    return (copy[key] ?? copy[fallback]);
}
