Backendless.initApp(process.env.BACKENDLESS_APP_ID, process.env.BACKENDLESS_API_KEY)

export const Game = Backendless.Data.of('game')
export const Score = Backendless.Data.of('score')

export const listBestScores = ({limit}) => {
  const qb = Backendless.DataQueryBuilder.create()
  const date = new Date().valueOf() - 30 * 60 * 60 * 1000

  qb.setPageSize(limit)
  qb.setSortBy(['score'])
  qb.setWhereClause(`created after ${date}`)

  return Score.find(qb)
}

export const listBestTimes = ({limit}) => {
  const qb = Backendless.DataQueryBuilder.create()
  const date = new Date().valueOf() - 30 * 60 * 60 * 1000

  qb.setPageSize(limit)
  qb.setSortBy(['duration asc'])
  qb.setWhereClause(`created after ${date}`)

  return Score.find(qb)
}
