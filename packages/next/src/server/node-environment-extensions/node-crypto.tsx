/**
 * We extend node:crypto APIs during builds and revalidates to ensure that prerenders don't observe random bytes
 * When cacheComponents is enabled. Random bytes are a form of IO even if they resolve synchronously. When cacheComponents is
 * enabled we need to ensure that random bytes are excluded from prerenders unless they are cached.
 *
 *
 * The extensions here never error nor alter the underlying return values and thus should be transparent to callers.
 */

import { io, getOriginalFunction, markUnwrappedFunction } from './io-utils'

if (process.env.NEXT_RUNTIME === 'edge') {
  // nothing to patch
} else {
  const nodeCrypto = require('node:crypto') as typeof import('node:crypto')

  // require('node:crypto').getRandomValues is an alias for
  // crypto.getRandomValues which is extended in web-crypto.tsx

  // require('node:crypto').randomUUID is not an alias for crypto.randomUUID

  const randomUUIDExpression = "`require('node:crypto').randomUUID()`"
  try {
    const _randomUUID = getOriginalFunction(nodeCrypto.randomUUID)
    nodeCrypto.randomUUID = markUnwrappedFunction(function randomUUID() {
      io(randomUUIDExpression, 'random')
      return _randomUUID.apply(this, arguments as any)
    }, _randomUUID)
  } catch {
    console.error(
      `Failed to install ${randomUUIDExpression} extension. When using \`cacheComponents\` calling this function will not correctly trigger dynamic behavior.`
    )
  }

  const randomBytesExpression = "`require('node:crypto').randomBytes(size)`"
  try {
    const _randomBytes = getOriginalFunction(nodeCrypto.randomBytes)
    // @ts-expect-error -- TODO: tell TS the overloads are preserved
    nodeCrypto.randomBytes = markUnwrappedFunction(function randomBytes() {
      if (typeof arguments[1] !== 'function') {
        // randomBytes is sync if the second arg is undefined
        io(randomBytesExpression, 'random')
      }
      return _randomBytes.apply(this, arguments as any)
    }, _randomBytes)
  } catch {
    console.error(
      `Failed to install ${randomBytesExpression} extension. When using \`cacheComponents\` calling this function without a callback argument will not correctly trigger dynamic behavior.`
    )
  }

  const randomFillSyncExpression =
    "`require('node:crypto').randomFillSync(...)`"
  try {
    const _randomFillSync = getOriginalFunction(nodeCrypto.randomFillSync)
    // @ts-expect-error -- TODO: tell TS the overloads are preserved
    nodeCrypto.randomFillSync = markUnwrappedFunction(function randomFillSync() {
      io(randomFillSyncExpression, 'random')
      return _randomFillSync.apply(this, arguments as any)
    }, _randomFillSync)
  } catch {
    console.error(
      `Failed to install ${randomFillSyncExpression} extension. When using \`cacheComponents\` calling this function will not correctly trigger dynamic behavior.`
    )
  }

  const randomIntExpression = "`require('node:crypto').randomInt(min, max)`"
  try {
    const _randomInt = getOriginalFunction(nodeCrypto.randomInt)
    // @ts-expect-error -- TODO: tell TS the overloads are preserved
    nodeCrypto.randomInt = markUnwrappedFunction(function randomInt() {
      if (typeof arguments[2] !== 'function') {
        // randomInt is sync if the third arg is undefined
        io(randomIntExpression, 'random')
      }
      return _randomInt.apply(this, arguments as any)
    }, _randomInt)
  } catch {
    console.error(
      `Failed to install ${randomBytesExpression} extension. When using \`cacheComponents\` calling this function without a callback argument will not correctly trigger dynamic behavior.`
    )
  }

  const generatePrimeSyncExpression =
    "`require('node:crypto').generatePrimeSync(...)`"
  try {
    const _generatePrimeSync = getOriginalFunction(nodeCrypto.generatePrimeSync)
    // @ts-expect-error -- TODO: tell TS the overloads are preserved
    nodeCrypto.generatePrimeSync = markUnwrappedFunction(function generatePrimeSync() {
      io(generatePrimeSyncExpression, 'random')
      return _generatePrimeSync.apply(this, arguments as any)
    }, _generatePrimeSync)
  } catch {
    console.error(
      `Failed to install ${generatePrimeSyncExpression} extension. When using \`cacheComponents\` calling this function will not correctly trigger dynamic behavior.`
    )
  }

  const generateKeyPairSyncExpression =
    "`require('node:crypto').generateKeyPairSync(...)`"
  try {
    const _generateKeyPairSync = getOriginalFunction(nodeCrypto.generateKeyPairSync)
    // @ts-expect-error -- TODO: tell TS the overloads are preserved
    nodeCrypto.generateKeyPairSync = markUnwrappedFunction(function generateKeyPairSync() {
      io(generateKeyPairSyncExpression, 'random')
      return _generateKeyPairSync.apply(this, arguments as any)
    }, _generateKeyPairSync)
  } catch {
    console.error(
      `Failed to install ${generateKeyPairSyncExpression} extension. When using \`cacheComponents\` calling this function will not correctly trigger dynamic behavior.`
    )
  }

  const generateKeySyncExpression =
    "`require('node:crypto').generateKeySync(...)`"
  try {
    const _generateKeySync = getOriginalFunction(nodeCrypto.generateKeySync)
    nodeCrypto.generateKeySync = markUnwrappedFunction(function generateKeySync() {
      io(generateKeySyncExpression, 'random')
      return _generateKeySync.apply(this, arguments as any)
    }, _generateKeySync)
  } catch {
    console.error(
      `Failed to install ${generateKeySyncExpression} extension. When using \`cacheComponents\` calling this function will not correctly trigger dynamic behavior.`
    )
  }
}
