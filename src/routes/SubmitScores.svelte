<script>
  import {onMount, onDestroy} from 'svelte'
  import {navigate, Link} from 'svelte-routing'
  import {holes} from 'util/config.js'
  import {store, game} from 'util/state.js'
  import {sum, prop, formatTime, formatScore} from 'util/misc.js'
  import {Game, ScoreCard} from 'util/api.js'
  import ScoreCards from 'partials/ScoreCards'

  if (!$game) {
    navigate('/')
  }

  let error = ''

  const duration = $game.end - $game.start

  const submitScores = async () => {
    error = ''

    try {
      await Promise.all([
        Game.save({
          id: $game.id,
          end: $game.end,
          start: $game.start,
          course: $game.course,
        }),
        ScoreCard.bulkCreate(
          $game.scoreCards.map(({player, scores}) => ({
            player,
            game: $game.id,
            score: sum(scores),
            scores: JSON.stringify(scores),
            duration,
          }))
        ),
      ])
    } catch (e) {
      error = "We couldn't save your scores, please try again."

      return
    }

    navigate('/game/complete')

    $store.game = null
  }
</script>

<div class="flex justify-between pb-4">
  <h2 class="font-bold uppercase">Game Summary</h2>
  <span class="font-mono">{formatTime(duration)}</span>
</div>
<ScoreCards scoreCards={$game.scoreCards} />
<div class="text-red-500 pt-4 text-center">&nbsp;{error}&nbsp;</div>
<div class="flex justify-center align-center pt-8 pb-10">
  <div>
    <button class="bg-red-500 rounded py-2 px-4 mb-2 font-bold" on:click={submitScores}>
      Submit Scores
    </button>
    <div class="text-sm text-center">
      Or, <span class="underline cursor-pointer"><Link to="/">Go Home</Link></span>
    </div>
  </div>
</div>
