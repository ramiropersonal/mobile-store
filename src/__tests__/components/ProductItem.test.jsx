import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductItem from '../../components/ProductItem/ProductItem.jsx'

const product = {
  id: 'abc123',
  brand: 'Samsung',
  model: 'Galaxy S21',
  price: '699',
  imgUrl: 'https://example.com/phone.jpg',
}

function renderItem(p = product) {
  return render(
    <MemoryRouter>
      <ProductItem product={p} />
    </MemoryRouter>
  )
}

describe('ProductItem', () => {
  it('renders brand and model', () => {
    renderItem()
    expect(screen.getByText('Samsung')).toBeInTheDocument()
    expect(screen.getByText('Galaxy S21')).toBeInTheDocument()
  })

  it('renders price with euro symbol', () => {
    renderItem()
    expect(screen.getByText(/699/)).toBeInTheDocument()
  })

  it('shows "Precio no disponible" when price is empty', () => {
    renderItem({ ...product, price: '' })
    expect(screen.getByText(/precio no disponible/i)).toBeInTheDocument()
  })

  it('renders product image with correct src and alt', () => {
    renderItem()
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', product.imgUrl)
    expect(img).toHaveAttribute('alt', `${product.brand} ${product.model}`)
  })

  it('renders a link to the product detail page', () => {
    renderItem()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', `/product/${product.id}`)
  })
})
