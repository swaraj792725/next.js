/* eslint-env jest */
import { getPreloadableFonts } from 'next/dist/server/app-render/get-preloadable-fonts'

describe('getPreloadableFonts', () => {
  const mockManifest = {
    pages: {},
    app: {
      'app/layout': ['static/media/font-hash.woff2'],
      'app/dashboard/page': ['static/media/dashboard-font.woff2'],
    },
    pagesUsingSizeAdjust: false,
    appUsingSizeAdjust: false,
  }

  it('should return preloadable fonts for standard single-dot file paths', () => {
    const injected = new Set<string>()
    const fonts = getPreloadableFonts(mockManifest, 'app/layout.tsx', injected)
    expect(fonts).toEqual(['static/media/font-hash.woff2'])
    expect(injected.has('static/media/font-hash.woff2')).toBe(true)
  })

  it('should return preloadable fonts for multi-dot pageExtensions (e.g. layout.page.tsx)', () => {
    const injected = new Set<string>()
    const fonts = getPreloadableFonts(
      mockManifest,
      'app/layout.page.tsx',
      injected
    )
    expect(fonts).toEqual(['static/media/font-hash.woff2'])
    expect(injected.has('static/media/font-hash.woff2')).toBe(true)
  })

  it('should return null when no fonts are found for path', () => {
    const injected = new Set<string>()
    const fonts = getPreloadableFonts(
      mockManifest,
      'app/unknown.tsx',
      injected
    )
    expect(fonts).toBeNull()
  })
})
