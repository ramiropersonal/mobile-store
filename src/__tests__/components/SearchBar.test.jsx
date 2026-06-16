import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from '../../components/SearchBar/SearchBar.jsx'

describe('SearchBar', () => {
  it('renders search input with placeholder', () => {
    render(<SearchBar value="" onChange={() => {}} />)
    expect(screen.getByPlaceholderText(/buscar por marca o modelo/i)).toBeInTheDocument()
  })

  it('displays the current value', () => {
    render(<SearchBar value="Apple" onChange={() => {}} />)
    expect(screen.getByDisplayValue('Apple')).toBeInTheDocument()
  })

  it('calls onChange with new value on each keystroke', async () => {
    const onChange = vi.fn()
    render(<SearchBar value="" onChange={onChange} />)

    await userEvent.type(screen.getByRole('searchbox'), 'Sam')

    expect(onChange).toHaveBeenCalledTimes(3)
    expect(onChange).toHaveBeenLastCalledWith('m')
  })

  it('has accessible aria-label', () => {
    render(<SearchBar value="" onChange={() => {}} />)
    expect(screen.getByLabelText(/buscar productos/i)).toBeInTheDocument()
  })
})
