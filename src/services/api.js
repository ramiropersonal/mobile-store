import { cache } from './cache.js'

const BASE_URL = 'https://itx-frontend-test.onrender.com'

export async function getProducts() {
  const key = 'products'
  const hit = cache.get(key)
  if (hit) return hit

  const res = await fetch(`${BASE_URL}/api/product`)
  if (!res.ok) throw new Error('Error al obtener los productos')
  const data = await res.json()
  cache.set(key, data)
  return data
}

export async function getProduct(id) {
  const key = `product:${id}`
  const hit = cache.get(key)
  if (hit) return hit

  const res = await fetch(`${BASE_URL}/api/product/${id}`)
  if (!res.ok) throw new Error('Error al obtener el producto')
  const data = await res.json()
  cache.set(key, data)
  return data
}

export async function addToCart({ id, colorCode, storageCode }) {
  const res = await fetch(`${BASE_URL}/api/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, colorCode, storageCode }),
  })
  if (!res.ok) throw new Error('Error al añadir al carrito')
  return res.json()
}
