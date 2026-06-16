import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import Header from './components/Header/Header.jsx'
import ProductList from './pages/ProductList/ProductList.jsx'
import ProductDetail from './pages/ProductDetail/ProductDetail.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </main>
      </CartProvider>
    </BrowserRouter>
  )
}
