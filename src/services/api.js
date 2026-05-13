const BASE_URL = import.meta.env.VITE_API_URL;
export class ApiError extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = 'ApiError';
    }
}
export async function apiRequest(endpoint, options, token) {
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: { ...headers, ...(options?.headers ?? {}) },
    });
    if (!res.ok) {
        const body = await res.text().catch(() => res.statusText);
        throw new ApiError(res.status, body);
    }
    return res.json();
}
export function getBaseUrl() {
    return BASE_URL;
}
