export declare function pickLocale<C extends Record<string, unknown>>(copy: C, lang: string | undefined | null, fallback?: keyof C): C[keyof C];
