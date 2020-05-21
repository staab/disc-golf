export const formatTime = duration => {
  const minutes = Math.round(duration / 60)
  const seconds = Math.floor(duration % 60).toString().padStart(2, '0')

  return `${minutes}:${seconds}`
}

export const formatScore = (score, par) => {
  const sign = score >= par ? "+" : "-"
  const diff = Math.abs(score - par)

  return `${score} (${sign}${diff})`
}
