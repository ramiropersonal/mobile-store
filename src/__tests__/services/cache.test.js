import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { cache } from '../../services/cache.js'

describe('MemoryCache', () => {
  beforeEach(() => cache.clear())
  afterEach(() => vi.useRealTimers())

  it('stores and retrieves a value', () => {
    cache.set('key', 'value')
    expect(cache.get('key')).toBe('value')
  })

  it('returns null for missing key', () => {
    expect(cache.get('missing')).toBeNull()
  })

  it('returns null after TTL expires', () => {
    vi.useFakeTimers()
    cache.set('key', 'value')
    vi.advanceTimersByTime(60 * 60 * 1000 + 1)
    expect(cache.get('key')).toBeNull()
  })

  it('returns value before TTL expires', () => {
    vi.useFakeTimers()
    cache.set('key', 'value')
    vi.advanceTimersByTime(60 * 60 * 1000 - 1)
    expect(cache.get('key')).toBe('value')
  })

  it('stores objects correctly', () => {
    const obj = { id: 1, name: 'test' }
    cache.set('obj', obj)
    expect(cache.get('obj')).toEqual(obj)
  })

  it('clears all stored values', () => {
    cache.set('k1', 'v1')
    cache.set('k2', 'v2')
    cache.clear()
    expect(cache.get('k1')).toBeNull()
    expect(cache.get('k2')).toBeNull()
  })

  it('uses different keys independently', () => {
    cache.set('a', 1)
    cache.set('b', 2)
    expect(cache.get('a')).toBe(1)
    expect(cache.get('b')).toBe(2)
  })
})
