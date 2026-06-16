import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProduct } from '../../services/api.js'
import ProductDescription from '../../components/ProductDescription/ProductDescription.jsx'
import ProductActions from '../../components/ProductActions/ProductActions.jsx'
import styles from './ProductDetail.module.css'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getProduct(id)
      .then(setProduct)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className={styles.center}>Cargando producto...</div>
  if (error) return <div className={styles.center + ' ' + styles.error}>{error}</div>
  if (!product) return null

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.back}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Volver al listado
      </Link>

      <div className={styles.detail}>
        <div className={styles.imageCol}>
          <img
            src={product.imgUrl}
            alt={`${product.brand} ${product.model}`}
            className={styles.image}
            onError={e => { e.target.style.visibility = 'hidden' }}
          />
        </div>

        <div className={styles.infoCol}>
          <ProductDescription product={product} />
          <ProductActions product={product} />
        </div>
      </div>
    </div>
  )
}
