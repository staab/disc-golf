import {writable, derived, get} from 'svelte/store'
import {prop} from 'util/misc.js'

const defaultState = JSON.stringify({players: [], game: null})

export const installPrompt = writable(null)
export const online = writable(navigator.onLine)
export const store = writable(JSON.parse(localStorage.getItem('store') || defaultState))
export const players = derived(store, prop('players'))
export const game = derived(store, prop('game'))

store.subscribe($store => {
  if (!process.env.PRODUCTION) {
    console.log($store)
  }

  localStorage.setItem('store', JSON.stringify($store))
})
