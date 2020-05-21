export const formatTime = duration => {
  duration = duration / 1000

  const minutes = Math.floor(duration / 60)
  const seconds = Math.floor(duration % 60).toString().padStart(2, '0')

  return `${minutes}:${seconds}`
}

export const formatScore = (score, par) => {
  const sign = score >= par ? "+" : "-"
  const diff = Math.abs(score - par)

  return `${score} (${sign}${diff})`
}

export const sum = xs => xs.reduce((a, b) => a + b, 0)

export const prop = k => x => x[k]
