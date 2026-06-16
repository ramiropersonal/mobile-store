import { render, screen } from '@testing-library/react'
import ProductDescription from '../../components/ProductDescription/ProductDescription.jsx'

const product = {
  brand: 'Apple',
  model: 'iPhone 12',
  price: '799',
  cpu: 'A14 Bionic',
  ram: '4 GB RAM',
  os: 'iOS 14',
  displayResolution: '2532 x 1170 pixels',
  displaySize: '6.1 inches',
  battery: '2815 mAh',
  primaryCamera: ['12 MP', 'f/1.6'],
  secondaryCmera: '12 MP',
  dimentions: '146.7 x 71.5 x 7.4 mm',
  weight: '164',
}

describe('ProductDescription', () => {
  it('renders brand and model as heading', () => {
    render(<ProductDescription product={product} />)
    expect(screen.getByRole('heading', { name: /apple iphone 12/i })).toBeInTheDocument()
  })

  it('renders all required attributes', () => {
    render(<ProductDescription product={product} />)
    expect(screen.getByText('A14 Bionic')).toBeInTheDocument()
    expect(screen.getByText('4 GB RAM')).toBeInTheDocument()
    expect(screen.getByText('iOS 14')).toBeInTheDocument()
    expect(screen.getByText('2532 x 1170 pixels')).toBeInTheDocument()
    expect(screen.getByText('2815 mAh')).toBeInTheDocument()
    expect(screen.getByText('146.7 x 71.5 x 7.4 mm')).toBeInTheDocument()
  })

  it('renders primary camera as joined string', () => {
    render(<ProductDescription product={product} />)
    expect(screen.getByText('12 MP, f/1.6')).toBeInTheDocument()
  })

  it('does not render rows for missing fields', () => {
    render(<ProductDescription product={{ brand: 'X', model: 'Y', price: '' }} />)
    expect(screen.queryByText('CPU')).not.toBeInTheDocument()
  })
})
