/* eslint-env jest */
import { getOriginalFunction, markUnwrappedFunction } from 'next/src/server/node-environment-extensions/io-utils'

describe('node-environment-extensions realm unwrapping', () => {
  it('prevents function wrapper chaining when repeatedly monkey-patching globals across realms', () => {
    const nativeFn = function originalRandomUUID() {
      return '1234-5678'
    }

    const targetObj = {
      randomUUID: nativeFn,
    }

    // Simulate Realm 1 installing extension
    const _random1 = getOriginalFunction(targetObj.randomUUID)
    expect(_random1).toBe(nativeFn)

    const wrapper1 = function randomUUIDRealm1() {
      return _random1()
    }
    targetObj.randomUUID = markUnwrappedFunction(wrapper1, _random1)

    // Simulate Realm 2 installing extension over Realm 1's patched function
    const _random2 = getOriginalFunction(targetObj.randomUUID)
    expect(_random2).toBe(nativeFn) // Must extract original native function, NOT wrapper1!

    const wrapper2 = function randomUUIDRealm2() {
      return _random2()
    }
    targetObj.randomUUID = markUnwrappedFunction(wrapper2, _random2)

    // Verify Realm 2 wrapper delegates directly to nativeFn
    expect(targetObj.randomUUID()).toBe('1234-5678')
    expect(getOriginalFunction(targetObj.randomUUID)).toBe(nativeFn)
  })
})
