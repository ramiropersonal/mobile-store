import { render } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from '../../context/CartContext.jsx'

export function renderWithRouter(ui, { route = '/', path = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <CartProvider>
        <Routes>
          <Route path={path} element={ui} />
        </Routes>
      </CartProvider>
    </MemoryRouter>
  )
}
