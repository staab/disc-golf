import {sum, randChoice, randInt} from 'util/misc.js'

const links = {
  shoes: ['https://amzn.to/374LU8I', 'https://amzn.to/3h5Tt3N'],
  bags: ['https://amzn.to/2AGSia4', 'https://amzn.to/3eTD4ND'],
  putters: ['https://amzn.to/3h0QrO8', 'https://amzn.to/30fyo0C'],
  midrange: ['https://amzn.to/3eW6zOZ'],
  drivers: ['https://amzn.to/30dCC8R', 'https://amzn.to/3gYMGbM'],
  discSets: ['https://amzn.to/3dF4IxI'],
  glasses: ['https://amzn.to/2MycAFp'],
}

const getLink = (key, text) => {
  const url = randChoice(links[key])

  return `<a class="underline" href="${url}" target="_blank">${text}</a>`
}

const nonPromotionals = [
  ad => `Hey ${ad.getRandom().player}, stop trying so hard, you'll get carpal tunnel.`,
  ad => `It's not a race, ${ad.getRandom().player}.`,
  ad => `Beastly strokes, ${ad.getWinner().player}.`,
  ad => `Maybe try squinting less, ${ad.getLoser().player}.`,
]

const promotionals = [
  ad => {
    const {player} = ad.getLoser()
    const link = getLink('shoes', 'these kicks')

    return `Hey ${player}, if you had better traction, you might keep up better. Check out ${link}.`
  },
  ad => {
    const {player} = ad.getWinner()
    const link = getLink('bags', 'new bag')

    return `Looking legit, ${player}. But for real, get a ${link}.`
  },
  ad => {
    const {player} = ad.getLoser()
    const link = randChoice([
      getLink('putters', 'new disc'),
      getLink('midrange', 'new disc'),
      getLink('drivers', 'new disc'),
    ])

    return `Word of advice ${player}, a ${link} might do you good.`
  },
  ad => {
    const {player} = ad.getLoser()
    const link = getLink('drivers', 'driver')

    return `You know, ${player}, you wouldn't have to throw so hard if you had a ${link}.`
  },
  ad => {
    const {player} = ad.getRandom()
    const link = getLink('glasses', 'sunglasses')

    return `Check out these ${link}, ${player}. They'll improve your game AND make you look cool.`
  },
]

export default class Ad {
  constructor({scoreCards}) {
    this.scoreCards = scoreCards
  }
  getRandom() {
    return randChoice(this.scoreCards)
  }
  getWinner() {
    return this.scoreCards.sort((a, b) => sum(a.scores) > sum(b.scores))[0]
  }
  getLoser() {
    return this.scoreCards.sort((a, b) => sum(a.scores) < sum(b.scores))[0]
  }
  getPromotional() {
    return randChoice(promotionals)(this)
  }
  getNonPromotional() {
    return randChoice(nonPromotionals)(this)
  }
  getText() {
    return Math.random() > 0.4 ? this.getPromotional() : this.getNonPromotional()
  }
}
