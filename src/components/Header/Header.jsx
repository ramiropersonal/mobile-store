import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext.jsx'
import styles from './Header.module.css'

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  )
}

function Breadcrumbs() {
  const location = useLocation()
  const isDetail = location.pathname.startsWith('/product/')

  if (!isDetail) {
    return (
      <nav aria-label="breadcrumb" className={styles.breadcrumb}>
        <span>Inicio</span>
      </nav>
    )
  }

  const productName = location.state?.productName || 'Detalle del producto'
  return (
    <nav aria-label="breadcrumb" className={styles.breadcrumb}>
      <Link to="/">Inicio</Link>
      <span className={styles.separator}>/</span>
      <span>{productName}</span>
    </nav>
  )
}

export default function Header() {
  const { cartCount } = useCart()

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo} aria-label="Mobile Store - Inicio">
        <PhoneIcon />
        <span>Mobile Store</span>
      </Link>

      <Breadcrumbs />

      <div className={styles.cart} aria-label={`Carrito: ${cartCount} productos`}>
        <CartIcon />
        <span className={styles.badge} data-testid="cart-count">{cartCount}</span>
      </div>
    </header>
  )
}
