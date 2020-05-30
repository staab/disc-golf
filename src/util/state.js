import {writable, get} from 'svelte/store'
import {prop, getPath, setPath} from 'util/misc.js'

export const cursor = (s, path, defaultValue = null) => ({
  set: v => s.set(setPath(path, get(s), v)),
  subscribe: f => s.subscribe(v => {
    const r = getPath(path, v)

    f(r === undefined ? defaultValue : r)
  }),
})

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
