import { useState } from 'react'
import { addToCart } from '../../services/api.js'
import { useCart } from '../../context/CartContext.jsx'
import styles from './ProductActions.module.css'

export default function ProductActions({ product }) {
  const { id, options } = product
  const colors = options?.colors ?? []
  const storages = options?.storages ?? []

  const [colorCode, setColorCode] = useState(colors[0]?.code ?? '')
  const [storageCode, setStorageCode] = useState(storages[0]?.code ?? '')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const { setCartCount } = useCart()

  async function handleAdd() {
    setLoading(true)
    setFeedback(null)
    try {
      const { count } = await addToCart({ id, colorCode, storageCode })
      setCartCount(count)
      setFeedback({ type: 'success', text: 'Producto añadido al carrito' })
    } catch {
      setFeedback({ type: 'error', text: 'Error al añadir al carrito' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.selectors}>
        <div className={styles.field}>
          <label htmlFor="storage" className={styles.fieldLabel}>Almacenamiento</label>
          <select
            id="storage"
            className={styles.select}
            value={storageCode}
            onChange={e => setStorageCode(Number(e.target.value))}
          >
            {storages.map(s => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="color" className={styles.fieldLabel}>Color</label>
          <select
            id="color"
            className={styles.select}
            value={colorCode}
            onChange={e => setColorCode(Number(e.target.value))}
          >
            {colors.map(c => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        className={styles.btn}
        onClick={handleAdd}
        disabled={loading || !colors.length || !storages.length}
      >
        {loading ? 'Añadiendo...' : 'Añadir al carrito'}
      </button>

      {feedback && (
        <p className={feedback.type === 'success' ? styles.success : styles.error} role="status">
          {feedback.text}
        </p>
      )}
    </div>
  )
}
