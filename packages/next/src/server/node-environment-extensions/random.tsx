/**
 * We extend Math.random() during builds and revalidates to ensure that prerenders don't observe randomness
 * When cacheComponents is enabled. randomness is a form of IO even though it resolves synchronously. When cacheComponents is
 * enabled we need to ensure that randomness is excluded from prerenders.
 *
 * The extensions here never error nor alter the random generation itself and thus should be transparent to callers.
 */

import { io, getOriginalFunction, markUnwrappedFunction } from './io-utils'

const expression = '`Math.random()`'
try {
  const _random = getOriginalFunction(Math.random)
  const fn = function random() {
    io(expression, 'random')
    return _random.apply(null, arguments as any)

    // We bind here to alter the `toString` printing to match `Math.random`'s native `toString`.
    // eslint-disable-next-line no-extra-bind
  }.bind(null)
  Object.defineProperty(fn, 'name', { value: 'random' })
  Math.random = markUnwrappedFunction(fn, _random)
} catch {
  console.error(
    `Failed to install ${expression} extension. When using \`cacheComponents\` calling this function will not correctly trigger dynamic behavior.`
  )
}
