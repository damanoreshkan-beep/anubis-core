import { createClient } from '@supabase/supabase-js';
// Coordinates a SINGLE Supabase client across all Anubis widgets on a page.
// Multiple clients racing on refresh-token rotation break getSession() in
// whichever refreshes second, so widgets ask via the `anubis-need-supabase`
// DOM event and the first responder shares its client. A host (site/launcher)
// can also answer the event to supply its own client.
export function obtainSharedClient(url, key) {
    if (typeof document === 'undefined') {
        return url && key ? createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }) : null;
    }
    const ev = new CustomEvent('anubis-need-supabase', {
        detail: {},
        bubbles: true,
        composed: true,
    });
    document.dispatchEvent(ev);
    const provided = ev.detail.client;
    if (provided)
        return provided;
    if (!url || !key)
        return null;
    const fresh = createClient(url, key, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
    // Register self as the provider for any sibling widget that mounts after
    // us. Filling event.detail.client only when nobody else has answered keeps
    // any host-supplied client's precedence.
    document.addEventListener('anubis-need-supabase', (e) => {
        const d = e.detail;
        if (d && !d.client)
            d.client = fresh;
    });
    return fresh;
}
