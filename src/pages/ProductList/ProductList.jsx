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
  const [slowHint, setSlowHint] = useState(false)
  const [fetchKey, setFetchKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await getProducts()
        if (!cancelled) setProducts(data)
      } catch (err) {
        if (!cancelled) {
          const msg = err.name === 'AbortError'
            ? 'El servidor tardó demasiado en responder. Puede estar iniciándose.'
            : err.message || 'Error al cargar los productos'
          setError(msg)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [fetchKey])

  useEffect(() => {
    if (!loading) return
    const id = setTimeout(() => setSlowHint(true), 5000)
    return () => clearTimeout(id)
  }, [loading])

  function handleRetry() {
    setLoading(true)
    setError(null)
    setSlowHint(false)
    setFetchKey(k => k + 1)
  }

  const filtered = products.filter(p => {
    const q = query.toLowerCase()
    return p.brand.toLowerCase().includes(q) || p.model.toLowerCase().includes(q)
  })

  if (loading) {
    return (
      <div className={styles.center}>
        <div className={styles.spinner} aria-hidden="true" />
        <p>Cargando productos...</p>
        {slowHint && (
          <p className={styles.hint}>
            El servidor puede tardar en arrancar la primera vez. Por favor, espera.
          </p>
        )}
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.center}>
        <p className={styles.error}>{error}</p>
        <button className={styles.retryBtn} onClick={handleRetry}>
          Reintentar
        </button>
      </div>
    )
  }

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
