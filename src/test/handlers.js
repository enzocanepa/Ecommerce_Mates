import { http, HttpResponse } from 'msw'

const BASE = 'http://localhost:3000'

// ── Sample data ──────────────────────────────────────────────────────────────

export const MOCK_USER = {
    id: 'user-uuid-123',
    email: 'test@test.com',
    name: 'Test User',
    role: 'user',
}

export const MOCK_ADMIN = {
    id: 'admin-uuid-456',
    email: 'admin@test.com',
    name: 'Admin User',
    role: 'admin',
}

export const MOCK_PRODUCTS = [
    {
        id: 1,
        name: 'Mate Calabaza',
        description: 'Mate tradicional',
        fullDescription: 'Descripción completa del mate',
        price: 2500,
        image: 'https://example.com/mate.jpg',
        category: 'mates',
        stock: 10,
        images: [],
        variants: [],
    },
    {
        id: 2,
        name: 'Bombilla Imperial',
        description: 'Bombilla de calidad',
        fullDescription: null,
        price: 1200,
        image: 'https://example.com/bombilla.jpg',
        category: 'bombillas',
        stock: 5,
        images: [],
        variants: [],
    },
]

export const MOCK_ORDERS = [
    {
        id: 'order-uuid-789',
        user: MOCK_USER,
        total: 2500,
        status: 'pending',
        createdAt: '2026-05-31T10:00:00',
        items: [
            {
                id: 1,
                product: { id: 1, name: 'Mate Calabaza', image: '', price: 2500 },
                quantity: 1,
                price: 2500,
            },
        ],
    },
]

// ── Auth handlers ─────────────────────────────────────────────────────────────

export const handlers = [
    http.post(`${BASE}/api/auth/signup`, async ({ request }) => {
        const body = await request.json()
        if (!body.name || !body.email || !body.password) {
            return HttpResponse.json({ error: 'Datos inválidos' }, { status: 400 })
        }
        if (body.email === 'existing@test.com') {
            return HttpResponse.json(
                { error: 'Ya existe una cuenta con ese email' },
                { status: 409 },
            )
        }
        return HttpResponse.json(
            {
                token: 'mock-jwt-token',
                user: { ...MOCK_USER, email: body.email, name: body.name },
            },
            { status: 201 },
        )
    }),

    http.post(`${BASE}/api/auth/login`, async ({ request }) => {
        const body = await request.json()
        if (body.email === 'test@test.com' && body.password === 'password123') {
            return HttpResponse.json({ token: 'mock-jwt-token', user: MOCK_USER })
        }
        return HttpResponse.json(
            { error: 'Email o contraseña incorrectos' },
            { status: 401 },
        )
    }),

    // ── Product handlers ─────────────────────────────────────────────────────

    http.get(`${BASE}/api/products`, () => {
        return HttpResponse.json({ products: MOCK_PRODUCTS })
    }),

    http.get(`${BASE}/api/products/:id`, ({ params }) => {
        const product = MOCK_PRODUCTS.find(p => p.id === Number(params.id))
        if (!product)
            return HttpResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
        return HttpResponse.json({ product })
    }),

    http.post(`${BASE}/api/products`, async ({ request }) => {
        const body = await request.json()
        const newProduct = { id: 99, ...body, images: [], variants: [] }
        return HttpResponse.json({ product: newProduct }, { status: 201 })
    }),

    http.put(`${BASE}/api/products/:id`, async ({ params, request }) => {
        const body = await request.json()
        const existing = MOCK_PRODUCTS.find(p => p.id === Number(params.id))
        if (!existing)
            return HttpResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
        return HttpResponse.json({ product: { ...existing, ...body } })
    }),

    http.delete(`${BASE}/api/products/:id`, ({ params }) => {
        const existing = MOCK_PRODUCTS.find(p => p.id === Number(params.id))
        if (!existing)
            return HttpResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
        return HttpResponse.json({ success: true })
    }),

    // ── Order handlers ───────────────────────────────────────────────────────

    http.get(`${BASE}/api/orders`, () => {
        return HttpResponse.json({ orders: MOCK_ORDERS })
    }),

    http.post(`${BASE}/api/orders`, async ({ request }) => {
        const body = await request.json()
        const order = {
            id: 'new-order-uuid',
            user: MOCK_USER,
            total: body.total,
            status: 'pending',
            createdAt: new Date().toISOString(),
            items: body.cart ?? [],
        }
        return HttpResponse.json({ order }, { status: 201 })
    }),

    http.get(`${BASE}/api/orders/admin`, () => {
        return HttpResponse.json({ orders: MOCK_ORDERS })
    }),

    http.patch(`${BASE}/api/orders/:id`, async ({ params, request }) => {
        const body = await request.json()
        return HttpResponse.json({
            order: { ...MOCK_ORDERS[0], id: params.id, status: body.status },
        })
    }),

    // ── Cart handlers ────────────────────────────────────────────────────────

    http.get(`${BASE}/api/cart`, () => {
        return HttpResponse.json({ cart: [] })
    }),

    http.post(`${BASE}/api/cart`, () => {
        return HttpResponse.json({ success: true })
    }),

    // ── Review handlers ──────────────────────────────────────────────────────

    http.get(`${BASE}/api/reviews/:productId`, () => {
        return HttpResponse.json({ reviews: [] })
    }),

    http.post(`${BASE}/api/reviews`, async ({ request }) => {
        const body = await request.json()
        const review = {
            id: 1,
            rating: body.rating,
            comment: body.comment,
            user: { id: MOCK_USER.id, name: MOCK_USER.name },
            createdAt: new Date().toISOString(),
        }
        return HttpResponse.json({ review }, { status: 201 })
    }),

    // ── Checkout handlers ────────────────────────────────────────────────────

    http.post(`${BASE}/api/checkout/create-preference`, async ({ request }) => {
        const body = await request.json()
        if (!body.items || body.items.length === 0) {
            return HttpResponse.json({ error: 'No hay ítems en el carrito' }, { status: 400 })
        }
        return HttpResponse.json({
            init_point: 'https://sandbox.mercadopago.com/checkout/v1/redirect',
            preference_id: 'PREF-MOCK-123',
        })
    }),
]
