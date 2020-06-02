import {writable, derived, get} from 'svelte/store'
import {prop, getPath, setPath} from 'util/misc.js'

export const cursor = (s, path, defaultValue = null) => {
  const set = v => s.update(_s => setPath(path, v, _s))

  const update = f => s.update(v => setPath(path, f(getPath(path, v)), v))

  const subscribe = f => s.subscribe(v => {
    const r = getPath(path, v)

    f(r === undefined ? defaultValue : r)
  })

  return {set, update, subscribe}
}

const defaultState = JSON.stringify({players: [], game: null})

export const installPrompt = writable(null)
export const online = writable(navigator.onLine)
export const store = writable(JSON.parse(localStorage.getItem('store') || defaultState))
export const players = cursor(store, ['players'])
export const game = cursor(store, ['game'])

store.subscribe($store => {
  if (!process.env.PRODUCTION) {
    console.log($store)
  }

  localStorage.setItem('store', JSON.stringify($store))
})


export class Timer {
  constructor() {
    this._previouslyElapsed = 0
    this.startTime = writable(null)
    this.currentTime = writable(null)
    this.elapsed = derived(
      [this.startTime, this.currentTime],
      ([startTime, currentTime]) =>
        (currentTime - startTime || 0) + this._previouslyElapsed
    )

    this.publicState = derived(
      [this.startTime, this.elapsed],
      ([startTime, elapsed]) =>
        ({running: Boolean(startTime), elapsed})
    )
  }
  subscribe(f) {
    return this.publicState.subscribe(f)
  }
  start(startTime = new Date().valueOf()) {
    this.startTime.set(startTime)
    this.tick()
  }
  stop() {
    this._previouslyElapsed = get(this.elapsed)
    this.startTime.set(null)
  }
  tick() {
    if (!get(this.startTime)) {
      return
    }

    this.currentTime.set(new Date().valueOf())

    requestAnimationFrame(() => this.tick())
  }
}
