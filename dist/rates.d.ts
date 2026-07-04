export interface Rates {
    USD: number;
    RUB: number;
    fetchedAt: number;
}
export declare function readCachedRates(): Rates | null;
export declare function isFresh(rates: Rates | null): boolean;
export declare function fetchRates(): Promise<Rates>;
