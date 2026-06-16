import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from '../../context/CartContext.jsx'
import ProductDetail from '../../pages/ProductDetail/ProductDetail.jsx'
import * as api from '../../services/api.js'

vi.mock('../../services/api.js')

const product = {
  id: '1',
  brand: 'Apple',
  model: 'iPhone 12',
  price: '799',
  imgUrl: 'https://example.com/img.jpg',
  cpu: 'A14 Bionic',
  ram: '4 GB',
  os: 'iOS 14',
  displayResolution: '2532x1170',
  displaySize: '6.1 inches',
  battery: '2815 mAh',
  primaryCamera: ['12 MP'],
  secondaryCmera: '12 MP',
  dimentions: '146.7 x 71.5 x 7.4 mm',
  weight: '164',
  options: {
    colors: [{ code: 1000, name: 'Black' }],
    storages: [{ code: 2000, name: '64 GB' }],
  },
}

function renderPage(id = '1') {
  return render(
    <MemoryRouter initialEntries={[`/product/${id}`]}>
      <CartProvider>
        <Routes>
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </CartProvider>
    </MemoryRouter>
  )
}

describe('ProductDetail', () => {
  it('shows loading state initially', () => {
    api.getProduct.mockReturnValue(new Promise(() => {}))
    renderPage()
    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
  })

  it('renders product brand and model after loading', async () => {
    api.getProduct.mockResolvedValue(product)
    renderPage()

    await waitFor(() => expect(screen.getByText('Apple iPhone 12')).toBeInTheDocument())
  })

  it('renders product image', async () => {
    api.getProduct.mockResolvedValue(product)
    renderPage()

    await waitFor(() => screen.getByText('Apple iPhone 12'))
    expect(screen.getByRole('img', { name: /apple iphone 12/i })).toBeInTheDocument()
  })

  it('shows a back link to the product list', async () => {
    api.getProduct.mockResolvedValue(product)
    renderPage()

    await waitFor(() => expect(screen.getByText(/volver al listado/i)).toBeInTheDocument())
    expect(screen.getByRole('link', { name: /volver/i })).toHaveAttribute('href', '/')
  })

  it('renders storage selector', async () => {
    api.getProduct.mockResolvedValue(product)
    renderPage()

    await waitFor(() => screen.getByText('Apple iPhone 12'))
    expect(screen.getByLabelText(/almacenamiento/i)).toBeInTheDocument()
  })

  it('renders color selector', async () => {
    api.getProduct.mockResolvedValue(product)
    renderPage()

    await waitFor(() => screen.getByText('Apple iPhone 12'))
    expect(screen.getByLabelText(/color/i)).toBeInTheDocument()
  })

  it('shows error message on fetch failure', async () => {
    api.getProduct.mockRejectedValue(new Error('Not found'))
    renderPage()

    await waitFor(() => expect(screen.getByText(/not found/i)).toBeInTheDocument())
  })
})
