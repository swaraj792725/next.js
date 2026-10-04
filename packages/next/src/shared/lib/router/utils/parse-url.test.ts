import { parseUrl } from './parse-url'

describe('parseUrl', () => {
  it('should parse absolute URLs', () => {
    const res = parseUrl('https://example.com/some/path?foo=bar#hash')
    expect(res.pathname).toBe('/some/path')
    expect(res.hostname).toBe('example.com')
    expect(res.protocol).toBe('https:')
    expect(res.query).toEqual({ foo: 'bar' })
    expect(res.hash).toBe('#hash')
    expect(res.search).toBe('?foo=bar')
    expect(res.href).toBe('https://example.com/some/path?foo=bar#hash')
  })

  it('should parse relative URLs starting with /', () => {
    const res = parseUrl('/hello/world?test=123')
    expect(res.pathname).toBe('/hello/world')
    expect(res.query).toEqual({ test: '123' })
    expect(res.search).toBe('?test=123')
  })

  it('should handle asterisk request target without throwing', () => {
    const res = parseUrl('*')
    expect(res.pathname).toBe('*')
    expect(res.href).toBe('*')
    expect(res.query).toEqual({})
    expect(res.search).toBe('')
    expect(res.hash).toBe('')
    expect(res.protocol).toBeNull()
    expect(res.hostname).toBeNull()
  })

  it('should handle relative URLs without leading slash without throwing', () => {
    const res = parseUrl('api/test?param=value')
    expect(res.pathname).toBe('/api/test')
    expect(res.query).toEqual({ param: 'value' })
  })

  it('should handle empty string without throwing', () => {
    const res = parseUrl('')
    expect(res.pathname).toBe('/')
    expect(res.query).toEqual({})
  })
})
