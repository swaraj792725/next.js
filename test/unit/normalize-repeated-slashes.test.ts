/* eslint-env jest */
import { normalizeRepeatedSlashes } from 'next/dist/shared/lib/utils'

describe('normalizeRepeatedSlashes', () => {
  it('should normalize consecutive slashes in relative paths', () => {
    expect(normalizeRepeatedSlashes('/foo//bar')).toBe('/foo/bar')
    expect(normalizeRepeatedSlashes('/foo///bar////baz')).toBe('/foo/bar/baz')
  })

  it('should preserve query parameters while normalizing slashes', () => {
    expect(normalizeRepeatedSlashes('/foo//bar?q=1//2')).toBe('/foo/bar?q=1//2')
  })

  it('should preserve protocol scheme (http://, https://) at the beginning of absolute URLs', () => {
    expect(normalizeRepeatedSlashes('https://example.com/foo//bar')).toBe(
      'https://example.com/foo/bar'
    )
    expect(normalizeRepeatedSlashes('http://localhost:3000//api///users')).toBe(
      'http://localhost:3000/api/users'
    )
  })

  it('should preserve embedded protocol schemes in path segments (e.g. image proxies)', () => {
    expect(
      normalizeRepeatedSlashes('/image/https://i.imgur.com/V7WhMQt.jpeg')
    ).toBe('/image/https://i.imgur.com/V7WhMQt.jpeg')
  })

  it('should replace backslashes with forward slashes', () => {
    expect(normalizeRepeatedSlashes('\\foo\\bar')).toBe('/foo/bar')
  })
})
