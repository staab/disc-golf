Backendless.initApp(process.env.BACKENDLESS_APP_ID, process.env.BACKENDLESS_API_KEY)

export const Score = Backendless.Data.of('score')
export const ScoreCard = Backendless.Data.of('score_card')

export const listBestScores = () => {
  const qb = Backendless.DataQueryBuilder.create()

  qb.setSortBy(['score'])

  return Score.find(qb)
}

export const listBestTimes = () => {
  const qb = Backendless.DataQueryBuilder.create()

  qb.setSortBy(['time'])

  return Score.find(qb)
}
