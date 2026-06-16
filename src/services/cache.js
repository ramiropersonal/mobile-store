const CACHE_TTL = 60 * 60 * 1000

class MemoryCache {
  constructor() {
    this._store = new Map()
  }

  get(key) {
    const entry = this._store.get(key)
    if (!entry) return null
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      this._store.delete(key)
      return null
    }
    return entry.value
  }

  set(key, value) {
    this._store.set(key, { value, timestamp: Date.now() })
  }

  clear() {
    this._store.clear()
  }
}

export const cache = new MemoryCache()
