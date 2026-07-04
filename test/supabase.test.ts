import { describe, it, expect, vi, afterEach } from 'vitest'

// Stub the SDK so no real network client is created; each call returns a
// distinct sentinel so we can assert identity and call counts.
vi.mock('@supabase/supabase-js', () => ({
    createClient: vi.fn((url: string, key: string) => ({ __client: true, url, key })),
}))

import { createClient } from '@supabase/supabase-js'
import { obtainSharedClient } from '../src/supabase'

const cc = createClient as unknown as ReturnType<typeof vi.fn>

// obtainSharedClient registers a document listener when it creates a
// client; track and drop any listener WE add, and clear the mock. Tests
// that create a client (and thus leak the internal provider listener)
// run last so the leak can't bleed into the isolation-sensitive cases.
const added: EventListener[] = []
function onNeed(h: EventListener) {
    added.push(h)
    document.addEventListener('anubis-need-supabase', h)
}
afterEach(() => {
    added.splice(0).forEach(h => document.removeEventListener('anubis-need-supabase', h))
    cc.mockClear()
})

describe('obtainSharedClient', () => {
    it('returns null when nobody responds and no url/key is given', () => {
        expect(obtainSharedClient()).toBeNull()
        expect(cc).not.toHaveBeenCalled()
    })

    it('reuses a host-provided client instead of creating its own', () => {
        const hostClient = { __host: true }
        onNeed(e => {
            ;(e as CustomEvent).detail.client = hostClient
        })
        const got = obtainSharedClient('https://x.supabase.co', 'anon-key')
        expect(got).toBe(hostClient)
        expect(cc).not.toHaveBeenCalled()
    })

    // The core race-prevention guarantee: exactly one client per page,
    // shared with every sibling widget that mounts afterwards.
    it('creates one client and shares that same instance with later siblings', () => {
        const first = obtainSharedClient('https://x.supabase.co', 'anon-key')
        expect(cc).toHaveBeenCalledTimes(1)

        const second = obtainSharedClient('https://x.supabase.co', 'anon-key')
        expect(second).toBe(first)
        expect(cc).toHaveBeenCalledTimes(1)
    })
})
