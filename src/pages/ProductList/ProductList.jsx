import { useState, useEffect } from 'react'
import { getProducts } from '../../services/api.js'
import SearchBar from '../../components/SearchBar/SearchBar.jsx'
import ProductItem from '../../components/ProductItem/ProductItem.jsx'
import styles from './ProductList.module.css'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter(p => {
    const q = query.toLowerCase()
    return p.brand.toLowerCase().includes(q) || p.model.toLowerCase().includes(q)
  })

  if (loading) return <div className={styles.center}>Cargando productos...</div>
  if (error) return <div className={styles.center + ' ' + styles.error}>{error}</div>

  return (
    <div className={styles.page}>
      <div className={styles.searchBar}>
        <SearchBar value={query} onChange={setQuery} />
        <p className={styles.count}>
          {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
          {query && ` encontrados para "${query}"`}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className={styles.empty}>No se encontraron productos para &quot;{query}&quot;</p>
      ) : (
        <ul className={styles.grid} role="list">
          {filtered.map(product => (
            <li key={product.id}>
              <ProductItem product={product} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
