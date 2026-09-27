/* eslint-env jest */
import EventEmitter from 'node:events'

describe('unhandled-rejection process listener target forwarding', () => {
  it('forwards event listeners to custom target process instances instead of hardcoding global process', () => {
    // Create a mock process instance that inherits from EventEmitter
    const customProcess = new EventEmitter() as any
    customProcess.on = EventEmitter.prototype.on.bind(customProcess)
    customProcess.addListener = EventEmitter.prototype.addListener.bind(customProcess)
    customProcess.removeListener = EventEmitter.prototype.removeListener.bind(customProcess)
    customProcess.removeAllListeners = EventEmitter.prototype.removeAllListeners.bind(customProcess)

    const dummyListener = () => {}

    // Attach listener to customProcess
    customProcess.on('customException', dummyListener)

    // Verify customProcess received the listener and global process did NOT receive it
    expect(customProcess.listeners('customException')).toContain(dummyListener)
    expect(process.listeners('customException' as any)).not.toContain(dummyListener)
  })
})
