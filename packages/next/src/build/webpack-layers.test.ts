import { WEBPACK_LAYERS } from '../lib/constants'
import {
  shouldUseReactServerCondition,
  isWebpackClientOnlyLayer,
  isWebpackDefaultLayer,
  isWebpackBundledLayer,
  isWebpackAppPagesLayer,
} from './webpack-layers'

describe('webpack-layers', () => {
  describe('shouldUseReactServerCondition', () => {
    it('returns true for serverOnly group layers', () => {
      expect(
        shouldUseReactServerCondition(WEBPACK_LAYERS.reactServerComponents)
      ).toBe(true)
      expect(
        shouldUseReactServerCondition(WEBPACK_LAYERS.actionBrowser)
      ).toBe(true)
    })

    it('returns false for non-serverOnly layers and null/undefined', () => {
      expect(
        shouldUseReactServerCondition(WEBPACK_LAYERS.serverSideRendering)
      ).toBe(false)
      expect(shouldUseReactServerCondition(WEBPACK_LAYERS.client)).toBe(false)
      expect(shouldUseReactServerCondition(null)).toBe(false)
      expect(shouldUseReactServerCondition(undefined)).toBe(false)
    })
  })

  describe('isWebpackClientOnlyLayer', () => {
    it('returns true for clientOnly group layers', () => {
      expect(isWebpackClientOnlyLayer(WEBPACK_LAYERS.client)).toBe(true)
    })

    it('returns false for other layers', () => {
      expect(
        isWebpackClientOnlyLayer(WEBPACK_LAYERS.reactServerComponents)
      ).toBe(false)
      expect(isWebpackClientOnlyLayer(null)).toBe(false)
      expect(isWebpackClientOnlyLayer(undefined)).toBe(false)
    })
  })

  describe('isWebpackDefaultLayer', () => {
    it('returns true for null, undefined, and pagesDir layers', () => {
      expect(isWebpackDefaultLayer(null)).toBe(true)
      expect(isWebpackDefaultLayer(undefined)).toBe(true)
      expect(isWebpackDefaultLayer(WEBPACK_LAYERS.pagesDirBrowser)).toBe(true)
      expect(isWebpackDefaultLayer(WEBPACK_LAYERS.pagesDirEdge)).toBe(true)
      expect(isWebpackDefaultLayer(WEBPACK_LAYERS.pagesDirNode)).toBe(true)
    })

    it('returns false for app directory layers', () => {
      expect(
        isWebpackDefaultLayer(WEBPACK_LAYERS.reactServerComponents)
      ).toBe(false)
      expect(isWebpackDefaultLayer(WEBPACK_LAYERS.serverSideRendering)).toBe(
        false
      )
    })
  })

  describe('isWebpackBundledLayer', () => {
    it('returns true for bundled group layers', () => {
      expect(
        isWebpackBundledLayer(WEBPACK_LAYERS.reactServerComponents)
      ).toBe(true)
      expect(isWebpackBundledLayer(WEBPACK_LAYERS.serverSideRendering)).toBe(
        true
      )
      expect(isWebpackBundledLayer(WEBPACK_LAYERS.actionBrowser)).toBe(true)
    })

    it('returns false for unbundled layers and null/undefined', () => {
      expect(isWebpackBundledLayer(null)).toBe(false)
      expect(isWebpackBundledLayer(undefined)).toBe(false)
    })
  })

  describe('isWebpackAppPagesLayer', () => {
    it('returns true for appPages group layers', () => {
      expect(
        isWebpackAppPagesLayer(WEBPACK_LAYERS.reactServerComponents)
      ).toBe(true)
      expect(
        isWebpackAppPagesLayer(WEBPACK_LAYERS.serverSideRendering)
      ).toBe(true)
      expect(isWebpackAppPagesLayer(WEBPACK_LAYERS.appPagesBrowser)).toBe(true)
    })

    it('returns false for pagesDir and null/undefined', () => {
      expect(isWebpackAppPagesLayer(WEBPACK_LAYERS.pagesDirBrowser)).toBe(false)
      expect(isWebpackAppPagesLayer(null)).toBe(false)
      expect(isWebpackAppPagesLayer(undefined)).toBe(false)
    })
  })
})
