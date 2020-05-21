export const getState = () =>
  JSON.parse(localStorage.getItem('state') || '{}')

export const setState = state =>
  localStorage.setItem('state', JSON.stringify({...getState(), ...state}))

export const replaceState = state =>
  localStorage.setItem('state', JSON.stringify(state))

