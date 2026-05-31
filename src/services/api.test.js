import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiRequest, ApiError, getBaseUrl } from './api'

// ── Helpers ───────────────────────────────────────────────────────────────────

function mockFetch(status, body) {
    const json = typeof body === 'string' ? body : JSON.stringify(body)
    global.fetch = vi.fn().mockResolvedValue({
        ok: status >= 200 && status < 300,
        status,
        statusText: status === 200 ? 'OK' : 'Error',
        json: () => Promise.resolve(body),
        text: () => Promise.resolve(json),
    })
}

// ── getBaseUrl ────────────────────────────────────────────────────────────────

describe('getBaseUrl', () => {
    it('returns the VITE_API_URL env variable', () => {
        // In tests, import.meta.env.VITE_API_URL is undefined by default.
        // getBaseUrl() returns it as-is (undefined or the set value).
        const url = getBaseUrl()
        // Should not throw
        expect(typeof url === 'string' || url === undefined).toBe(true)
    })
})

// ── apiRequest ────────────────────────────────────────────────────────────────

describe('apiRequest', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('should add Authorization header when token is provided', async () => {
        mockFetch(200, { products: [] })

        await apiRequest('/api/products', undefined, 'my-token-abc')

        expect(fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: 'Bearer my-token-abc',
                }),
            }),
        )
    })

    it('should NOT add Authorization header when no token is provided', async () => {
        mockFetch(200, { products: [] })

        await apiRequest('/api/products')

        const callArgs = fetch.mock.calls[0][1]
        expect(callArgs.headers.Authorization).toBeUndefined()
    })

    it('should set Content-Type to application/json', async () => {
        mockFetch(200, {})

        await apiRequest('/api/products')

        expect(fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                }),
            }),
        )
    })

    it('should return parsed JSON on successful response', async () => {
        const mockData = { products: [{ id: 1, name: 'Mate' }] }
        mockFetch(200, mockData)

        const result = await apiRequest('/api/products')
        expect(result).toEqual(mockData)
    })

    it('should throw ApiError when response is not ok (404)', async () => {
        mockFetch(404, { error: 'Not found' })

        await expect(apiRequest('/api/products/999')).rejects.toThrow(ApiError)
    })

    it('should throw ApiError with correct status code on 401', async () => {
        mockFetch(401, { error: 'Unauthorized' })

        try {
            await apiRequest('/api/orders', undefined, 'invalid-token')
            expect.fail('Should have thrown')
        } catch (err) {
            expect(err).toBeInstanceOf(ApiError)
            expect(err.status).toBe(401)
        }
    })

    it('should throw ApiError with correct status code on 403', async () => {
        mockFetch(403, { error: 'Forbidden' })

        try {
            await apiRequest('/api/products', { method: 'POST', body: '{}' }, 'user-token')
            expect.fail('Should have thrown')
        } catch (err) {
            expect(err).toBeInstanceOf(ApiError)
            expect(err.status).toBe(403)
        }
    })

    it('should throw ApiError with correct status code on 500', async () => {
        mockFetch(500, { error: 'Internal Server Error' })

        try {
            await apiRequest('/api/products')
            expect.fail('Should have thrown')
        } catch (err) {
            expect(err).toBeInstanceOf(ApiError)
            expect(err.status).toBe(500)
        }
    })

    it('should merge custom options with default headers', async () => {
        mockFetch(201, { product: { id: 1 } })

        await apiRequest('/api/products', {
            method: 'POST',
            body: JSON.stringify({ name: 'Test' }),
        }, 'token123')

        expect(fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ name: 'Test' }),
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer token123',
                }),
            }),
        )
    })

    it('ApiError should have name set to ApiError', async () => {
        mockFetch(422, { error: 'Unprocessable' })

        try {
            await apiRequest('/api/something')
        } catch (err) {
            expect(err.name).toBe('ApiError')
        }
    })
})
