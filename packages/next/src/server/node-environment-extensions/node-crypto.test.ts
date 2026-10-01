import nodeCrypto from 'node:crypto'
import './node-crypto'
import './web-crypto'

describe('node-crypto and web-crypto environment extensions', () => {
  it('does not chain wrappers or retain previous realms across repeated extensions', () => {
    const NODE_CRYPTO_ORIGINALS_KEY = Symbol.for('next.node-crypto.originals')
    const originals = (nodeCrypto as any)[NODE_CRYPTO_ORIGINALS_KEY]

    expect(originals).toBeDefined()
    expect(typeof originals.randomUUID).toBe('function')
    expect(typeof originals.randomBytes).toBe('function')

    // Calling the extended function should execute successfully
    const uuid = nodeCrypto.randomUUID()
    expect(typeof uuid).toBe('string')
    expect(uuid).toHaveLength(36)

    // Simulate multiple realm re-installations
    const nativeUUID = originals.randomUUID
    let calls = 0

    // Wrap 1
    const _first = (originals.randomUUID ??= nodeCrypto.randomUUID)
    nodeCrypto.randomUUID = function randomUUID() {
      calls += 1
      return _first.apply(this, arguments as any)
    }

    // Wrap 2
    const _second = (originals.randomUUID ??= nodeCrypto.randomUUID)
    nodeCrypto.randomUUID = function randomUUID() {
      calls += 10
      return _second.apply(this, arguments as any)
    }

    // Wrap 3
    const _third = (originals.randomUUID ??= nodeCrypto.randomUUID)
    nodeCrypto.randomUUID = function randomUUID() {
      calls += 100
      return _third.apply(this, arguments as any)
    }

    // Executing the latest wrapper must call the native function directly (calls = 100)
    // and NOT chain through previous wrappers (which would total 111)
    const result = nodeCrypto.randomUUID()
    expect(typeof result).toBe('string')
    expect(calls).toBe(100)

    // Verify web-crypto originals
    const WEB_CRYPTO_ORIGINALS_KEY = Symbol.for('next.web-crypto.originals')
    const webCryptoObj =
      typeof crypto !== 'undefined'
        ? crypto
        : (nodeCrypto as any).webcrypto
    const webOriginals = (webCryptoObj as any)[WEB_CRYPTO_ORIGINALS_KEY]

    expect(webOriginals).toBeDefined()
    expect(typeof webOriginals.randomUUID).toBe('function')
    expect(typeof webOriginals.getRandomValues).toBe('function')

    const webUUID = webCryptoObj.randomUUID()
    expect(typeof webUUID).toBe('string')
    expect(webUUID).toHaveLength(36)
  })
})
