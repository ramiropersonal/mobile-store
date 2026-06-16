import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CartContext } from '../../context/CartContext.jsx'
import Header from '../../components/Header/Header.jsx'

function renderHeader(cartCount = 0, route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <CartContext.Provider value={{ cartCount, setCartCount: vi.fn() }}>
        <Header />
      </CartContext.Provider>
    </MemoryRouter>
  )
}

describe('Header', () => {
  it('renders the logo text', () => {
    renderHeader()
    expect(screen.getByText('Mobile Store')).toBeInTheDocument()
  })

  it('logo is a link to the home page', () => {
    renderHeader()
    expect(screen.getByRole('link', { name: /mobile store/i })).toHaveAttribute('href', '/')
  })

  it('displays cart count', () => {
    renderHeader(3)
    expect(screen.getByTestId('cart-count')).toHaveTextContent('3')
  })

  it('displays zero cart count by default', () => {
    renderHeader()
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0')
  })

  it('shows Inicio breadcrumb on root path', () => {
    renderHeader(0, '/')
    expect(screen.getByText('Inicio')).toBeInTheDocument()
  })

  it('shows back link to Inicio on product path', () => {
    renderHeader(0, '/product/123')
    expect(screen.getByRole('link', { name: 'Inicio' })).toBeInTheDocument()
  })
})
