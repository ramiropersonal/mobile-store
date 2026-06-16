import { Link } from 'react-router-dom'
import styles from './ProductItem.module.css'

export default function ProductItem({ product }) {
  const { id, brand, model, price, imgUrl } = product

  return (
    <Link
      to={`/product/${id}`}
      state={{ productName: `${brand} ${model}` }}
      className={styles.card}
      aria-label={`Ver detalles de ${brand} ${model}`}
    >
      <div className={styles.imageWrapper}>
        <img
          src={imgUrl || null}
          alt={`${brand} ${model}`}
          className={styles.image}
          loading="lazy"
          onError={e => { e.target.style.visibility = 'hidden' }}
        />
      </div>
      <div className={styles.info}>
        <p className={styles.brand}>{brand}</p>
        <p className={styles.model}>{model}</p>
        <p className={styles.price}>{price ? `${price} €` : 'Precio no disponible'}</p>
      </div>
    </Link>
  )
}
