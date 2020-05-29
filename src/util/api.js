import {round} from 'util/misc'

Backendless.initApp(process.env.BACKENDLESS_APP_ID, process.env.BACKENDLESS_API_KEY)

// Round so that we can cache scores for ~1 hour in service worker
const daysAgo = days =>
  round(new Date().valueOf() - days * 24 * 60 * 60 * 1000, 6)

export const Game = Backendless.Data.of('game')
export const ScoreCard = Backendless.Data.of('score_card')

export const listBestScores = ({limit}) => {
  const qb = Backendless.DataQueryBuilder.create()
  const date = daysAgo(30)
  console.log(date)

  qb.setPageSize(limit)
  qb.setSortBy(['score'])
  qb.setWhereClause(`created after ${date}`)

  return ScoreCard.find(qb)
}

export const listBestTimes = ({limit}) => {
  const qb = Backendless.DataQueryBuilder.create()
  const date = daysAgo(30)

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
