import { getRouteRegex } from './route-regex'
import { getRouteMatcher } from './route-matcher'
import { DecodeError } from '../../utils'

describe('getRouteMatcher', () => {
  it('extracts and decodes valid dynamic parameters', () => {
    const matcher = getRouteMatcher(getRouteRegex('/items/[slug]'))
    const match = matcher('/items/hello%20world')
    expect(match).toEqual({ slug: 'hello world' })
  })

  it('throws DecodeError for malformed percent-encoded dynamic segment', () => {
    const matcher = getRouteMatcher(getRouteRegex('/items/[slug]'))
    expect(() => matcher('/items/%E0%A4')).toThrow(DecodeError)
    expect(() => matcher('/items/100%')).toThrow(DecodeError)
  })

  it('returns false for paths that do not match the route', () => {
    const matcher = getRouteMatcher(getRouteRegex('/items/[slug]'))
    expect(matcher('/other/route')).toBe(false)
  })
})
