import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { createContext, useContext } from 'react'
import { CartProvider, useCart } from './CartContext'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('../services/cartService', () => ({
    cartService: {
        getCart: vi.fn().mockResolvedValue({ cart: [] }),
        saveCart: vi.fn().mockResolvedValue({ success: true }),
    },
}))

vi.mock('../services/n8nService', () => ({
    n8nService: {
        enviarCarritoAbandonado: vi.fn(),
        enviarCompraExitosa: vi.fn(),
        enviarCompraFallida: vi.fn(),
    },
}))

// We need to mock the AuthContext module so CartProvider gets the user we want
const MockAuthContext = createContext(null)

vi.mock('./AuthContext', () => {
    const React = require('react')
    const MockAuthContext = React.createContext(null)
    return {
        useAuth: () => React.useContext(MockAuthContext),
        AuthProvider: MockAuthContext.Provider,
        __MockAuthContext: MockAuthContext,
    }
})

// ── Helpers ───────────────────────────────────────────────────────────────────

const SAMPLE_PRODUCT = {
    id: 1,
    name: 'Mate Calabaza',
    price: 2500,
    image: 'https://example.com/mate.jpg',
    category: 'mates',
    stock: 10,
}

const UNAUTHENTICATED_AUTH = {
    user: null,
    accessToken: null,
    loading: false,
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    isAdmin: false,
}

const AUTHENTICATED_AUTH = {
    user: { id: 'u1', email: 'test@test.com', name: 'Test', role: 'user' },
    accessToken: 'mock-jwt-token',
    loading: false,
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    isAdmin: false,
}

// Import the mock context after mocking
async function getAuthContext() {
    const mod = await import('./AuthContext')
    return mod.__MockAuthContext
}

/**
 * Renders CartConsumer wrapped with a mocked auth value.
 */
function renderWithCart(ui, authValue = UNAUTHENTICATED_AUTH) {
    // Use AuthProvider (which is the mocked context Provider) directly
    const { AuthProvider } = require('./AuthContext')
    // Actually, since vi.mock hoists the mock, we use it differently.
    // We'll pass authValue via the context value.
    return render(
        <AuthProvider value={authValue}>
            <CartProvider>{ui}</CartProvider>
        </AuthProvider>
    )
}

// ── Test consumer component ───────────────────────────────────────────────────

function CartConsumer() {
    const { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart()

    return (
        <div>
            <span data-testid="count">{totalItems}</span>
            <span data-testid="total">{totalPrice}</span>
            <span data-testid="cart-length">{cart.length}</span>
            <ul>
                {cart.map(item => (
                    <li key={item.id} data-testid={`item-${item.id}`}>
                        {item.name} x{item.quantity}
                    </li>
                ))}
            </ul>
            <button onClick={() => addToCart(SAMPLE_PRODUCT, 1)}>Add</button>
            <button onClick={() => addToCart(SAMPLE_PRODUCT, 2)}>Add 2</button>
            <button onClick={() => removeFromCart(1)}>Remove</button>
            <button onClick={() => updateQuantity(1, 3)}>Set Qty 3</button>
            <button onClick={() => updateQuantity(1, 0)}>Set Qty 0</button>
            <button onClick={clearCart}>Clear</button>
        </div>
    )
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('CartContext', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.clearAllMocks()
    })

    afterEach(() => {
        localStorage.clear()
    })

    it('starts with an empty cart', async () => {
        renderWithCart(<CartConsumer />)
        await waitFor(() => {
            expect(screen.getByTestId('count').textContent).toBe('0')
            expect(screen.getByTestId('cart-length').textContent).toBe('0')
        })
    })

    it('adds a product to the cart', async () => {
        const user = userEvent.setup()
        renderWithCart(<CartConsumer />)

        await waitFor(() => screen.getByText('Add'))
        await user.click(screen.getByText('Add'))

        expect(screen.getByTestId('count').textContent).toBe('1')
        expect(screen.getByTestId('cart-length').textContent).toBe('1')
        expect(screen.getByTestId('item-1').textContent).toContain('Mate Calabaza')
    })

    it('increments quantity when same product is added twice', async () => {
        const user = userEvent.setup()
        renderWithCart(<CartConsumer />)

        await waitFor(() => screen.getByText('Add'))
        await user.click(screen.getByText('Add'))
        await user.click(screen.getByText('Add'))

        expect(screen.getByTestId('count').textContent).toBe('2')
        expect(screen.getByTestId('cart-length').textContent).toBe('1')
        expect(screen.getByTestId('item-1').textContent).toContain('x2')
    })

    it('adds multiple items in one click with quantity > 1', async () => {
        const user = userEvent.setup()
        renderWithCart(<CartConsumer />)

        await waitFor(() => screen.getByText('Add 2'))
        await user.click(screen.getByText('Add 2'))

        expect(screen.getByTestId('count').textContent).toBe('2')
    })

    it('removes a product from the cart', async () => {
        const user = userEvent.setup()
        renderWithCart(<CartConsumer />)

        await waitFor(() => screen.getByText('Add'))
        await user.click(screen.getByText('Add'))
        await user.click(screen.getByText('Remove'))

        expect(screen.getByTestId('count').textContent).toBe('0')
        expect(screen.getByTestId('cart-length').textContent).toBe('0')
    })

    it('updates quantity of a cart item', async () => {
        const user = userEvent.setup()
        renderWithCart(<CartConsumer />)

        await waitFor(() => screen.getByText('Add'))
        await user.click(screen.getByText('Add'))
        await user.click(screen.getByText('Set Qty 3'))

        expect(screen.getByTestId('count').textContent).toBe('3')
        expect(screen.getByTestId('item-1').textContent).toContain('x3')
    })

    it('removes item when quantity is set to 0', async () => {
        const user = userEvent.setup()
        renderWithCart(<CartConsumer />)

        await waitFor(() => screen.getByText('Add'))
        await user.click(screen.getByText('Add'))
        await user.click(screen.getByText('Set Qty 0'))

        expect(screen.getByTestId('count').textContent).toBe('0')
        expect(screen.getByTestId('cart-length').textContent).toBe('0')
    })

    it('clears the cart', async () => {
        const user = userEvent.setup()
        renderWithCart(<CartConsumer />)

        await waitFor(() => screen.getByText('Add'))
        await user.click(screen.getByText('Add'))
        await user.click(screen.getByText('Add'))
        await user.click(screen.getByText('Clear'))

        expect(screen.getByTestId('count').textContent).toBe('0')
        expect(screen.getByTestId('cart-length').textContent).toBe('0')
    })

    it('calculates totalPrice correctly', async () => {
        const user = userEvent.setup()
        renderWithCart(<CartConsumer />)

        await waitFor(() => screen.getByText('Add 2'))
        await user.click(screen.getByText('Add 2'))

        // price = 2500, quantity = 2 → total = 5000
        expect(screen.getByTestId('total').textContent).toBe('5000')
    })

    it('persists cart to localStorage when user is not logged in', async () => {
        const user = userEvent.setup()
        renderWithCart(<CartConsumer />, UNAUTHENTICATED_AUTH)

        await waitFor(() => screen.getByText('Add'))
        await user.click(screen.getByText('Add'))

        await waitFor(() => {
            const stored = localStorage.getItem('mateShopCart')
            expect(stored).not.toBeNull()
            const parsed = JSON.parse(stored)
            expect(parsed).toHaveLength(1)
            expect(parsed[0].id).toBe(1)
        })
    })

    it('useCart throws when used outside CartProvider', () => {
        // Suppress console.error for this test
        vi.spyOn(console, 'error').mockImplementation(() => {})
        expect(() => {
            render(<ContextConsumerOutsideProvider />)
        }).toThrow()
        vi.restoreAllMocks()
    })
})

function ContextConsumerOutsideProvider() {
    useCart() // Should throw
    return null
}
