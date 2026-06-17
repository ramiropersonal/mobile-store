import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getProducts, getProduct, addToCart } from '../../services/api.js'
import { cache } from '../../services/cache.js'

const mockFetch = (data, ok = true) =>
  vi.fn().mockResolvedValue({ ok, json: () => Promise.resolve(data) })

describe('API service', () => {
  beforeEach(() => {
    cache.clear()
    vi.restoreAllMocks()
  })

  describe('getProducts', () => {
    it('fetches products from API', async () => {
      const products = [{ id: '1', brand: 'Apple', model: 'iPhone' }]
      global.fetch = mockFetch(products)

      const result = await getProducts()

      expect(result).toEqual(products)
      expect(fetch).toHaveBeenCalledWith(
        'https://itx-frontend-test.onrender.com/api/product',
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      )
    })

    it('returns cached data on second call without re-fetching', async () => {
      const products = [{ id: '1', brand: 'Apple' }]
      global.fetch = mockFetch(products)

      await getProducts()
      await getProducts()

      expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('throws on non-ok response', async () => {
      global.fetch = mockFetch(null, false)
      await expect(getProducts()).rejects.toThrow()
    })
  })

  describe('getProduct', () => {
    it('fetches product by id', async () => {
      const product = { id: '1', brand: 'Apple', model: 'iPhone' }
      global.fetch = mockFetch(product)

      const result = await getProduct('1')

      expect(result).toEqual(product)
      expect(fetch).toHaveBeenCalledWith(
        'https://itx-frontend-test.onrender.com/api/product/1',
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      )
    })

    it('uses cache on second call for the same id', async () => {
      const product = { id: '1', brand: 'Apple' }
      global.fetch = mockFetch(product)

      await getProduct('1')
      await getProduct('1')

      expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('fetches separately for different ids', async () => {
      global.fetch = mockFetch({ id: '1' })

      await getProduct('1')
      await getProduct('2')

      expect(fetch).toHaveBeenCalledTimes(2)
    })

    it('throws on non-ok response', async () => {
      global.fetch = mockFetch(null, false)
      await expect(getProduct('1')).rejects.toThrow()
    })
  })

  describe('addToCart', () => {
    it('posts to cart endpoint with correct body', async () => {
      global.fetch = mockFetch({ count: 1 })

      const result = await addToCart({ id: '1', colorCode: 1000, storageCode: 2000 })

      expect(result).toEqual({ count: 1 })
      expect(fetch).toHaveBeenCalledWith(
        'https://itx-frontend-test.onrender.com/api/cart',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ id: '1', colorCode: 1000, storageCode: 2000 }),
        })
      )
    })

    it('throws on non-ok response', async () => {
      global.fetch = mockFetch(null, false)
      await expect(addToCart({ id: '1', colorCode: 1000, storageCode: 2000 })).rejects.toThrow()
    })
  })
})
