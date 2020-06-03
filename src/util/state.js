import {writable} from 'svelte/store'
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
  window.$store = $store

  localStorage.setItem('store', JSON.stringify($store))
})
