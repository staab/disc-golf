<script>
  import {onMount, onDestroy} from 'svelte'
  import {navigate, Link} from 'svelte-routing'
  import {store, game} from 'util/state.js'
  import {sum, prop, formatTime, formatScore} from 'util/misc.js'
  import {Game, ScoreCard} from 'util/api.js'
  import ScoreCards from 'partials/ScoreCards'
  import Card from 'partials/Card'

  if (!$game) {
    navigate('/')
  }

  let timeInput
  let editedTime = null

  const startEditingTime = () => {
    editedTime = formatTime($game.duration)

    setTimeout(() => timeInput.select())
  }

  const saveTimeEdit = () => {
    const matches = editedTime.match(/^(\d+):([0-5]\d)\.?(\d{1,2})?$/)

    if (!matches) {
      return alert("Please enter your time in this format: mm:ss")
    }

    const [m, s, cs] = matches.slice(1).map(x => parseInt(x, 10))

    $game.duration = m * 60 * 1000 + s * 1000 + (cs || 0) * 10
    editedTime = null
  }

  const submitScores = async () => {
    if (!window.avoidSideEffects) {
      await Promise.all([
        Game.save({
          id: $game.id,
          course: $game.course,
          duration: $game.duration,
        }),
        ScoreCard.bulkCreate(
          $game.scoreCards.map(({player, scores}) => ({
            player,
            game: $game.id,
            score: sum(scores),
            scores: JSON.stringify(scores),
            duration: $game.duration,
          }))
        ),
      ])
    }

    navigate('/game/complete')

    $store.game = null
  }
</script>

<style>
  .heading {
    height: 3rem;
  }

  input {
    line-height: 0.9;
    padding: 0 1px;
    width: 83px;
  }
</style>

<div class="flex justify-between pb-4 heading">
  <h2 class="font-bold uppercase">Game Summary</h2>
  {#if editedTime}
  <div class="font-mono">
    <input
      type="text"
      class="rounded text-gray-900 border-gray-500 border border-solid text-right"
      bind:this={timeInput}
      bind:value={editedTime} />
    <i class="fa fa-check text-red-500 cursor-pointer" on:click={saveTimeEdit} />
  </div>
  {:else}
  <span class="font-mono cursor-pointer" on:click={startEditingTime}>
    {formatTime($game.duration)}
    <i class="fa fa-edit text-red-500" />
  </span>
  {/if}
</div>
<Card>
  <ScoreCards scoreCards={$game.scoreCards} />
</Card>
<div class="flex justify-center align-center pt-8 pb-10">
  <div>
    <button class="bg-red-500 rounded py-2 px-4 mb-2 font-bold text-white" on:click={submitScores}>
      Submit Scores
    </button>
    <div class="text-sm text-center">
      Or, <span class="underline cursor-pointer"><Link to="/">Go Home</Link></span>
    </div>
  </div>
</div>
