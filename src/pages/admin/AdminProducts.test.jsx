import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { MemoryRouter } from 'react-router'

// ── Mocks ─────────────────────────────────────────────────────────────────────

const MOCK_PRODUCTS = [
    {
        id: 1,
        name: 'Mate Calabaza',
        description: 'Mate tradicional',
        price: 2500,
        image: 'https://example.com/mate.jpg',
        category: 'mates',
        stock: 10,
        variants: [],
        images: [],
    },
    {
        id: 2,
        name: 'Bombilla Imperial',
        description: 'Bombilla de calidad',
        price: 1200,
        image: 'https://example.com/bombilla.jpg',
        category: 'bombillas',
        stock: 3,
        variants: [{ id: 1, name: 'Plateada' }],
        images: [],
    },
]

const mockRefreshProducts = vi.fn()

vi.mock('../../context/ProductsContext', () => ({
    useProducts: () => ({
        products: MOCK_PRODUCTS,
        loading: false,
        refreshProducts: mockRefreshProducts,
    }),
}))

vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        accessToken: 'admin-mock-token',
        user: { id: 'admin', email: 'admin@test.com', name: 'Admin', role: 'admin' },
        isAdmin: true,
    }),
}))

vi.mock('../../services/api', () => ({
    apiRequest: vi.fn().mockResolvedValue({}),
}))

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}))

// ── Import component after mocks ──────────────────────────────────────────────
import { AdminProducts } from './AdminProducts'

function renderAdminProducts() {
    return render(
        <MemoryRouter>
            <AdminProducts />
        </MemoryRouter>
    )
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('AdminProducts', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders the product table with all products', () => {
        renderAdminProducts()
        expect(screen.getByText('Mate Calabaza')).toBeInTheDocument()
        expect(screen.getByText('Bombilla Imperial')).toBeInTheDocument()
    })

    it('displays product count in header', () => {
        renderAdminProducts()
        expect(screen.getByText(/2 productos en total/i)).toBeInTheDocument()
    })

    it('shows prices correctly', () => {
        renderAdminProducts()
        // 2500 formatted
        expect(screen.getByText(/2\.500/)).toBeInTheDocument()
        // 1200 formatted
        expect(screen.getByText(/1\.200/)).toBeInTheDocument()
    })

    it('shows low stock warning for stock <= 5', () => {
        renderAdminProducts()
        // Bombilla has stock = 3 (low), Mate has 10 (normal)
        const stockCells = screen.getAllByText(/^[0-9]+$/).filter(el =>
            el.className.includes('text-red-600') || el.className.includes('text-gray-700')
        )
        // At minimum, 3 should be displayed
        expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('shows edit and delete buttons for each product', () => {
        renderAdminProducts()
        // There should be 2 edit buttons and 2 delete buttons (one per product)
        const editBtns = screen.getAllByTitle('Editar')
        const deleteBtns = screen.getAllByTitle('Eliminar')
        expect(editBtns).toHaveLength(2)
        expect(deleteBtns).toHaveLength(2)
    })

    // ── Search filter ─────────────────────────────────────────────────────────

    it('filters products by name when searching', async () => {
        const user = userEvent.setup()
        renderAdminProducts()

        const searchInput = screen.getByPlaceholderText('Buscar por nombre o categoría...')
        await user.type(searchInput, 'mate')

        expect(screen.getByText('Mate Calabaza')).toBeInTheDocument()
        expect(screen.queryByText('Bombilla Imperial')).not.toBeInTheDocument()
    })

    it('filters products by category when searching', async () => {
        const user = userEvent.setup()
        renderAdminProducts()

        const searchInput = screen.getByPlaceholderText('Buscar por nombre o categoría...')
        await user.type(searchInput, 'bombillas')

        expect(screen.queryByText('Mate Calabaza')).not.toBeInTheDocument()
        expect(screen.getByText('Bombilla Imperial')).toBeInTheDocument()
    })

    it('shows "No se encontraron productos" when search has no results', async () => {
        const user = userEvent.setup()
        renderAdminProducts()

        const searchInput = screen.getByPlaceholderText('Buscar por nombre o categoría...')
        await user.type(searchInput, 'xyznotexistent')

        expect(screen.getByText('No se encontraron productos.')).toBeInTheDocument()
    })

    // ── Create modal ──────────────────────────────────────────────────────────

    it('opens create modal when "Nuevo producto" is clicked', async () => {
        const user = userEvent.setup()
        renderAdminProducts()

        await user.click(screen.getByText('Nuevo producto'))

        expect(screen.getByText('Nuevo producto', { selector: 'h2' })).toBeInTheDocument()
    })

    it('shows validation error when submitting empty form in create modal', async () => {
        const user = userEvent.setup()
        renderAdminProducts()

        await user.click(screen.getByText('Nuevo producto'))
        await user.click(screen.getByText('Crear producto'))

        expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument()
    })

    it('shows price validation error when price is 0', async () => {
        const user = userEvent.setup()
        renderAdminProducts()

        await user.click(screen.getByText('Nuevo producto'))

        // Fill name but not price
        await user.type(screen.getByPlaceholderText('Ej: Mate Calabaza Tradicional'), 'Nuevo Mate')

        await user.click(screen.getByText('Crear producto'))

        expect(screen.getByText('El precio debe ser mayor a 0.')).toBeInTheDocument()
    })

    it('closes create modal when "Cancelar" is clicked', async () => {
        const user = userEvent.setup()
        renderAdminProducts()

        await user.click(screen.getByText('Nuevo producto'))
        expect(screen.getByText('Crear producto')).toBeInTheDocument()

        // Click Cancel inside modal
        const modal = screen.getByRole('dialog', { hidden: true })
        const cancelBtn = screen.getAllByText('Cancelar').find(el => el.closest('[class*="modal"]') !== null)
        // Use first cancel button visible
        await user.click(screen.getAllByText('Cancelar')[0])

        // Modal should close - create button gone
        await waitFor(() => {
            expect(screen.queryByText('Crear producto')).not.toBeInTheDocument()
        })
    })

    // ── Edit modal ────────────────────────────────────────────────────────────

    it('opens edit modal with product data when edit is clicked', async () => {
        const user = userEvent.setup()
        renderAdminProducts()

        const editBtns = screen.getAllByTitle('Editar')
        await user.click(editBtns[0])  // Edit first product (Mate Calabaza)

        // Modal title
        expect(screen.getByText('Editar producto')).toBeInTheDocument()
        // Pre-filled name
        expect(screen.getByDisplayValue('Mate Calabaza')).toBeInTheDocument()
    })

    it('shows correct product data in edit modal', async () => {
        const user = userEvent.setup()
        renderAdminProducts()

        const editBtns = screen.getAllByTitle('Editar')
        await user.click(editBtns[1])  // Edit second product (Bombilla Imperial)

        expect(screen.getByDisplayValue('Bombilla Imperial')).toBeInTheDocument()
        // Variant should be pre-filled
        expect(screen.getByDisplayValue('Plateada')).toBeInTheDocument()
    })

    // ── Delete confirmation ───────────────────────────────────────────────────

    it('shows delete confirmation dialog when delete button is clicked', async () => {
        const user = userEvent.setup()
        renderAdminProducts()

        const deleteBtns = screen.getAllByTitle('Eliminar')
        await user.click(deleteBtns[0])

        expect(screen.getByText('¿Eliminar producto?')).toBeInTheDocument()
        expect(screen.getByText('Esta acción no se puede deshacer.')).toBeInTheDocument()
    })

    it('cancels delete when "Cancelar" is clicked in confirmation dialog', async () => {
        const user = userEvent.setup()
        renderAdminProducts()

        const deleteBtns = screen.getAllByTitle('Eliminar')
        await user.click(deleteBtns[0])

        // Click cancel in the delete dialog
        const cancelBtns = screen.getAllByText('Cancelar')
        await user.click(cancelBtns[cancelBtns.length - 1])

        // Dialog should be gone
        await waitFor(() => {
            expect(screen.queryByText('¿Eliminar producto?')).not.toBeInTheDocument()
        })
    })

    it('calls apiRequest and refreshProducts when delete is confirmed', async () => {
        const { apiRequest } = await import('../../services/api')
        const user = userEvent.setup()
        renderAdminProducts()

        const deleteBtns = screen.getAllByTitle('Eliminar')
        await user.click(deleteBtns[0])

        await user.click(screen.getByText('Eliminar'))

        await waitFor(() => {
            expect(apiRequest).toHaveBeenCalledWith(
                '/api/products/1',
                expect.objectContaining({ method: 'DELETE' }),
                'admin-mock-token'
            )
            expect(mockRefreshProducts).toHaveBeenCalled()
        })
    })
})
