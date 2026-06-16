import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartContext } from '../../context/CartContext.jsx'
import ProductActions from '../../components/ProductActions/ProductActions.jsx'
import * as api from '../../services/api.js'

vi.mock('../../services/api.js')

const product = {
  id: 'abc',
  options: {
    colors: [{ code: 1000, name: 'Black' }, { code: 1001, name: 'White' }],
    storages: [{ code: 2000, name: '64 GB' }, { code: 2001, name: '128 GB' }],
  },
}

function renderActions(setCartCount = vi.fn()) {
  return render(
    <CartContext.Provider value={{ cartCount: 0, setCartCount }}>
      <ProductActions product={product} />
    </CartContext.Provider>
  )
}

describe('ProductActions', () => {
  it('renders storage and color selectors', () => {
    renderActions()
    expect(screen.getByLabelText(/almacenamiento/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/color/i)).toBeInTheDocument()
  })

  it('pre-selects the first storage option', () => {
    renderActions()
    expect(screen.getByLabelText(/almacenamiento/i)).toHaveValue('2000')
  })

  it('pre-selects the first color option', () => {
    renderActions()
    expect(screen.getByLabelText(/color/i)).toHaveValue('1000')
  })

  it('renders all storage options', () => {
    renderActions()
    expect(screen.getByRole('option', { name: '64 GB' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: '128 GB' })).toBeInTheDocument()
  })

  it('renders all color options', () => {
    renderActions()
    expect(screen.getByRole('option', { name: 'Black' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'White' })).toBeInTheDocument()
  })

  it('calls addToCart when button is clicked', async () => {
    api.addToCart.mockResolvedValue({ count: 1 })
    renderActions()

    await userEvent.click(screen.getByRole('button', { name: /añadir al carrito/i }))

    await waitFor(() => expect(api.addToCart).toHaveBeenCalledWith({
      id: 'abc',
      colorCode: 1000,
      storageCode: 2000,
    }))
  })

  it('updates cart count with the value returned by the API', async () => {
    api.addToCart.mockResolvedValue({ count: 5 })
    const setCartCount = vi.fn()
    renderActions(setCartCount)

    await userEvent.click(screen.getByRole('button', { name: /añadir al carrito/i }))

    await waitFor(() => expect(setCartCount).toHaveBeenCalledWith(5))
  })

  it('shows success message after adding', async () => {
    api.addToCart.mockResolvedValue({ count: 1 })
    renderActions()

    await userEvent.click(screen.getByRole('button', { name: /añadir al carrito/i }))

    await waitFor(() => expect(screen.getByText(/añadido al carrito/i)).toBeInTheDocument())
  })

  it('shows error message when API fails', async () => {
    api.addToCart.mockRejectedValue(new Error('Error'))
    renderActions()

    await userEvent.click(screen.getByRole('button', { name: /añadir al carrito/i }))

    await waitFor(() => expect(screen.getByText(/error al añadir/i)).toBeInTheDocument())
  })
})
