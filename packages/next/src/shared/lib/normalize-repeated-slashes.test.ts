import { normalizeRepeatedSlashes } from './utils'

describe('normalizeRepeatedSlashes', () => {
  it('normalizes repeated forward slashes in relative paths', () => {
    expect(normalizeRepeatedSlashes('/foo//bar///baz')).toBe('/foo/bar/baz')
  })

  it('replaces backslashes with forward slashes', () => {
    expect(normalizeRepeatedSlashes('\\foo\\\\bar')).toBe('/foo/bar')
  })

  it('preserves query parameters without stripping query slashes', () => {
    expect(normalizeRepeatedSlashes('/foo//bar?param=1//2')).toBe(
      '/foo/bar?param=1//2'
    )
  })

  it('preserves protocol scheme in absolute URLs', () => {
    expect(normalizeRepeatedSlashes('https://example.com/foo//bar')).toBe(
      'https://example.com/foo/bar'
    )
    expect(normalizeRepeatedSlashes('http://localhost:3000///path')).toBe(
      'http://localhost:3000/path'
    )
  })

  it('handles absolute URLs with query parameters', () => {
    expect(
      normalizeRepeatedSlashes('https://example.com//foo///bar?q=a//b')
    ).toBe('https://example.com/foo/bar?q=a//b')
  })
})
