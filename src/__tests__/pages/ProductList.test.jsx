import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '../../context/CartContext.jsx'
import ProductList from '../../pages/ProductList/ProductList.jsx'
import * as api from '../../services/api.js'

vi.mock('../../services/api.js')

const products = [
  { id: '1', brand: 'Apple', model: 'iPhone 12', price: '799', imgUrl: '' },
  { id: '2', brand: 'Samsung', model: 'Galaxy S21', price: '699', imgUrl: '' },
  { id: '3', brand: 'Apple', model: 'iPhone 13', price: '999', imgUrl: '' },
]

function renderPage() {
  return render(
    <MemoryRouter>
      <CartProvider>
        <ProductList />
      </CartProvider>
    </MemoryRouter>
  )
}

describe('ProductList', () => {
  it('shows loading state initially', () => {
    api.getProducts.mockReturnValue(new Promise(() => {}))
    renderPage()
    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
  })

  it('renders all products after loading', async () => {
    api.getProducts.mockResolvedValue(products)
    renderPage()

    await waitFor(() => expect(screen.getByText('iPhone 12')).toBeInTheDocument())
    expect(screen.getByText('Galaxy S21')).toBeInTheDocument()
    expect(screen.getByText('iPhone 13')).toBeInTheDocument()
  })

  it('shows error message on fetch failure', async () => {
    api.getProducts.mockRejectedValue(new Error('Network error'))
    renderPage()

    await waitFor(() => expect(screen.getByText(/network error/i)).toBeInTheDocument())
  })

  it('filters products by brand', async () => {
    api.getProducts.mockResolvedValue(products)
    renderPage()

    await waitFor(() => screen.getByText('iPhone 12'))
    await userEvent.type(screen.getByRole('searchbox'), 'Samsung')

    expect(screen.queryByText('iPhone 12')).not.toBeInTheDocument()
    expect(screen.getByText('Galaxy S21')).toBeInTheDocument()
  })

  it('filters products by model', async () => {
    api.getProducts.mockResolvedValue(products)
    renderPage()

    await waitFor(() => screen.getByText('iPhone 12'))
    await userEvent.type(screen.getByRole('searchbox'), 'iPhone 13')

    expect(screen.queryByText('Galaxy S21')).not.toBeInTheDocument()
    expect(screen.getByText('iPhone 13')).toBeInTheDocument()
  })

  it('shows empty state when no products match search', async () => {
    api.getProducts.mockResolvedValue(products)
    renderPage()

    await waitFor(() => screen.getByText('iPhone 12'))
    await userEvent.type(screen.getByRole('searchbox'), 'Nokia')

    expect(screen.getByText(/no se encontraron/i)).toBeInTheDocument()
  })

  it('filter is case-insensitive', async () => {
    api.getProducts.mockResolvedValue(products)
    renderPage()

    await waitFor(() => screen.getByText('iPhone 12'))
    await userEvent.type(screen.getByRole('searchbox'), 'apple')

    expect(screen.getByText('iPhone 12')).toBeInTheDocument()
    expect(screen.queryByText('Galaxy S21')).not.toBeInTheDocument()
  })
})
