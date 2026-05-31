import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { MemoryRouter } from 'react-router'

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockNavigate = vi.fn()

vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router')
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
    }
})

// Mock cart context
const mockCart = [
    { id: 1, name: 'Mate Calabaza', price: 2500, image: '', quantity: 2, category: 'mates', stock: 10 },
]
const mockTotalPrice = 5000

vi.mock('../context/CartContext', () => ({
    useCart: () => ({
        cart: mockCart,
        totalPrice: mockTotalPrice,
        clearCart: vi.fn(),
    }),
}))

// Mock auth context
const mockUser = { id: 'u1', email: 'test@test.com', name: 'Test User', role: 'user' }
const mockAccessToken = 'mock-token'

vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        user: mockUser,
        accessToken: mockAccessToken,
        loading: false,
    }),
}))

// Mock api service
vi.mock('../services/api', () => ({
    getBaseUrl: () => 'http://localhost:3000',
}))

// Mock fetch globally
global.fetch = vi.fn()

// ── Import component after mocks ──────────────────────────────────────────────
import { Checkout } from './Checkout'

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderCheckout() {
    return render(
        <MemoryRouter>
            <Checkout />
        </MemoryRouter>
    )
}

function fillValidForm(user) {
    const actions = [
        () => userEvent.clear(screen.getByPlaceholderText('Juan Pérez')),
        () => userEvent.type(screen.getByPlaceholderText('Juan Pérez'), 'Juan Pérez'),
        () => userEvent.clear(screen.getByPlaceholderText('juan@ejemplo.com')),
        () => userEvent.type(screen.getByPlaceholderText('juan@ejemplo.com'), 'juan@ejemplo.com'),
        () => userEvent.clear(screen.getByPlaceholderText('+54 9 11 1234-5678')),
        () => userEvent.type(screen.getByPlaceholderText('+54 9 11 1234-5678'), '1112345678'),
        () => userEvent.clear(screen.getByPlaceholderText('Av. Corrientes 1234')),
        () => userEvent.type(screen.getByPlaceholderText('Av. Corrientes 1234'), 'Av. Test 123'),
        () => userEvent.clear(screen.getByPlaceholderText('Buenos Aires')),
        () => userEvent.type(screen.getByPlaceholderText('Buenos Aires'), 'Buenos Aires'),
        () => userEvent.selectOptions(screen.getByRole('combobox'), 'Buenos Aires'),
        () => userEvent.clear(screen.getByPlaceholderText('1000')),
        () => userEvent.type(screen.getByPlaceholderText('1000'), '1000'),
    ]
    return actions
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Checkout page', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        sessionStorage.clear()
    })

    afterEach(() => {
        vi.restoreAllMocks()
        sessionStorage.clear()
    })

    it('renders checkout form fields', () => {
        renderCheckout()
        expect(screen.getByPlaceholderText('Juan Pérez')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('juan@ejemplo.com')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('+54 9 11 1234-5678')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Av. Corrientes 1234')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Buenos Aires')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('1000')).toBeInTheDocument()
    })

    it('renders order summary with cart items', () => {
        renderCheckout()
        expect(screen.getByText('Mate Calabaza')).toBeInTheDocument()
        // Total should be displayed
        expect(screen.getAllByText(/5\.000/i).length).toBeGreaterThan(0)
    })

    it('shows validation error when name is empty on submit', async () => {
        const user = userEvent.setup()
        renderCheckout()

        // Clear pre-filled name
        const nameInput = screen.getByPlaceholderText('Juan Pérez')
        await user.clear(nameInput)

        await user.click(screen.getByText('Pagar con Mercado Pago'))

        expect(screen.getByText('Requerido')).toBeInTheDocument()
    })

    it('shows email validation error when email is invalid', async () => {
        const user = userEvent.setup()
        renderCheckout()

        const emailInput = screen.getByPlaceholderText('juan@ejemplo.com')
        await user.clear(emailInput)
        await user.type(emailInput, 'not-an-email')

        await user.click(screen.getByText('Pagar con Mercado Pago'))

        expect(screen.getByText('Email inválido')).toBeInTheDocument()
    })

    it('shows phone validation error when phone is too short', async () => {
        const user = userEvent.setup()
        renderCheckout()

        const phoneInput = screen.getByPlaceholderText('+54 9 11 1234-5678')
        await user.clear(phoneInput)
        await user.type(phoneInput, '123')

        await user.click(screen.getByText('Pagar con Mercado Pago'))

        await waitFor(() => {
            expect(screen.getByText(/teléfono inválido/i)).toBeInTheDocument()
        })
    })

    it('shows province validation error when province is not selected', async () => {
        const user = userEvent.setup()
        renderCheckout()

        // Fill all fields except province
        await user.type(screen.getByPlaceholderText('+54 9 11 1234-5678'), '1112345678')
        await user.type(screen.getByPlaceholderText('Av. Corrientes 1234'), 'Av. Test 123')
        await user.type(screen.getByPlaceholderText('Buenos Aires'), 'Buenos Aires')
        await user.type(screen.getByPlaceholderText('1000'), '1234')

        await user.click(screen.getByText('Pagar con Mercado Pago'))

        expect(screen.getByText('Requerido')).toBeInTheDocument()
    })

    it('shows API error when payment fails', async () => {
        const user = userEvent.setup()

        // Mock fetch to return error
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
            text: () => Promise.resolve(JSON.stringify({ error: 'Error de pago' })),
        })

        renderCheckout()

        // Fill form
        const phoneInput = screen.getByPlaceholderText('+54 9 11 1234-5678')
        await user.type(phoneInput, '1112345678')
        await user.type(screen.getByPlaceholderText('Av. Corrientes 1234'), 'Av. Test 123')
        await user.type(screen.getByPlaceholderText('Buenos Aires'), 'Buenos Aires')
        await user.selectOptions(screen.getByRole('combobox'), 'Córdoba')
        await user.type(screen.getByPlaceholderText('1000'), '5000')

        await user.click(screen.getByText('Pagar con Mercado Pago'))

        await waitFor(() => {
            expect(screen.getByText('Error de pago')).toBeInTheDocument()
        })
    })

    it('redirects to success on network error (simulated checkout)', async () => {
        const user = userEvent.setup()

        // Simulate network error (TypeError)
        global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))

        renderCheckout()

        // Fill required fields
        await user.type(screen.getByPlaceholderText('+54 9 11 1234-5678'), '1112345678')
        await user.type(screen.getByPlaceholderText('Av. Corrientes 1234'), 'Av. Test 123')
        await user.type(screen.getByPlaceholderText('Buenos Aires'), 'CABA')
        await user.selectOptions(screen.getByRole('combobox'), 'CABA')
        await user.type(screen.getByPlaceholderText('1000'), '1000')

        await user.click(screen.getByText('Pagar con Mercado Pago'))

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/checkout/exito?simulated=true')
        })
    })

    it('redirects to MP init_point on successful payment preference creation', async () => {
        const user = userEvent.setup()

        const originalLocation = window.location
        delete window.location
        window.location = { href: '' }

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            text: () => Promise.resolve(JSON.stringify({
                init_point: 'https://sandbox.mp.com/checkout',
                preference_id: 'PREF-123',
            })),
        })

        renderCheckout()

        await user.type(screen.getByPlaceholderText('+54 9 11 1234-5678'), '1112345678')
        await user.type(screen.getByPlaceholderText('Av. Corrientes 1234'), 'Calle Test 123')
        await user.type(screen.getByPlaceholderText('Buenos Aires'), 'Córdoba')
        await user.selectOptions(screen.getByRole('combobox'), 'Córdoba')
        await user.type(screen.getByPlaceholderText('1000'), '5000')

        await user.click(screen.getByText('Pagar con Mercado Pago'))

        await waitFor(() => {
            expect(window.location.href).toBe('https://sandbox.mp.com/checkout')
        })

        window.location = originalLocation
    })
})

describe('Checkout page — empty cart', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('shows empty cart message when cart is empty', async () => {
        // Override cart mock to return empty cart
        vi.doMock('../context/CartContext', () => ({
            useCart: () => ({
                cart: [],
                totalPrice: 0,
                clearCart: vi.fn(),
            }),
        }))

        // Re-import Checkout with new mock
        const { Checkout: CheckoutEmpty } = await import('./Checkout')

        render(
            <MemoryRouter>
                <CheckoutEmpty />
            </MemoryRouter>
        )

        expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()
        expect(screen.getByText('Volver a la tienda')).toBeInTheDocument()
    })
})
