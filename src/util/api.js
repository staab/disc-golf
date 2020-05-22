Backendless.initApp(process.env.BACKENDLESS_APP_ID, process.env.BACKENDLESS_API_KEY)

export const Game = Backendless.Data.of('game')
export const ScoreCard = Backendless.Data.of('score_card')

export const listBestScores = ({limit}) => {
  const qb = Backendless.DataQueryBuilder.create()
  const date = new Date().valueOf() - 30 * 60 * 60 * 1000

  qb.setPageSize(limit)
  qb.setSortBy(['score'])
  qb.setWhereClause(`created after ${date}`)

  return ScoreCard.find(qb)
}

export const listBestTimes = ({limit}) => {
  const qb = Backendless.DataQueryBuilder.create()
  const date = new Date().valueOf() - 30 * 60 * 60 * 1000

  qb.setPageSize(limit)
  qb.setSortBy(['duration asc'])
  qb.setWhereClause(`created after ${date}`)

  return ScoreCard.find(qb)
}

export const findScoresByGame = async gameId => {
  const qb = Backendless.DataQueryBuilder.create()

  qb.setWhereClause(`game = ${gameId}`)

  const scoreCards = await ScoreCard.find(qb)

  return scoreCards.map(
    ({scores, ...scoreCard}) =>
      ({...scoreCard, scores: JSON.parse(scores)})
  )
}

export const findGame = async id => {
  const qb = Backendless.DataQueryBuilder.create()

  qb.setWhereClause(`id = ${id}`)

  const [game] = await Game.find(qb)

  return game
}
