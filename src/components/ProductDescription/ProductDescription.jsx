import styles from './ProductDescription.module.css'

function Row({ label, value }) {
  if (!value && value !== 0) return null
  const display = Array.isArray(value) ? value.join(', ') : value
  return (
    <tr className={styles.row}>
      <th className={styles.label}>{label}</th>
      <td className={styles.value}>{display}</td>
    </tr>
  )
}

export default function ProductDescription({ product }) {
  const {
    brand, model, price, cpu, ram, os,
    displayResolution, displaySize,
    battery, primaryCamera, secondaryCmera,
    dimentions, weight,
  } = product

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{brand} {model}</h2>
      {price && <p className={styles.price}>{price} €</p>}
      <table className={styles.table}>
        <tbody>
          <Row label="Marca" value={brand} />
          <Row label="Modelo" value={model} />
          <Row label="Precio" value={price ? `${price} €` : null} />
          <Row label="CPU" value={cpu} />
          <Row label="RAM" value={ram} />
          <Row label="Sistema Operativo" value={os} />
          <Row label="Resolución" value={displayResolution} />
          <Row label="Tamaño pantalla" value={displaySize} />
          <Row label="Batería" value={battery} />
          <Row label="Cámara principal" value={primaryCamera} />
          <Row label="Cámara frontal" value={secondaryCmera} />
          <Row label="Dimensiones" value={dimentions} />
          <Row label="Peso" value={weight ? `${weight} g` : null} />
        </tbody>
      </table>
    </div>
  )
}
