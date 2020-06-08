export const copy = x => {
  if (x instanceof Array) return [...x]
  if (x instanceof Object) return {...x}

  return x
}

export const getPath = (path, data) => {
  let result = data

  path.forEach(p => {
    result = result[p]
  })

  return result
}

export const setProp = (p, value, data) => {
  let result = copy(data)

  result[p] = value

  return result
}

export const setPath = ([p, ...path], value, data) =>
  path.length === 0
    ? setProp(p, value, data)
    : setProp(p, setPath(path, value, data[p]), data)

export const formatTime = duration => {
  duration = duration / 1000

  const minutes = Math.floor(duration / 60)
  const seconds = Math.floor(duration % 60).toString().padStart(2, '0')
  const hundredths = Math.floor(duration * 100 % 100).toString().padStart(2, '0')

  return `${minutes}:${seconds}.${hundredths}`
}

export const formatScore = (score, par) => {
  const sign = score >= par ? "+" : "-"
  const diff = Math.abs(score - par)

  return `${score} (${sign}${diff})`
}

export const sum = xs => xs.reduce((a, b) => a + b, 0)

export const prop = k => x => x[k]

export const replaceSubdomain = subdomain => {
  const {host, protocol} = window.location
  const newHost = host.split('.').slice(-2).join('.')

  return `${protocol}//${subdomain}.${newHost}`
}

export const round = (n, digits = 0) => {
  const magnitude = Math.pow(10, digits)

  return Math.round(n / magnitude) * magnitude
}

export const log = (base, n) => Math.log(n) / Math.log(base)

export const randChoice = xs => xs[Math.floor(Math.random() * xs.length)]

export const randInt = (low, high) => Math.round(Math.random() * (high - low) + low)
