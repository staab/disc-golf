<script>
  import {getContext} from 'svelte'
  import {fly} from 'svelte/transition'
  import {get} from 'svelte/store'
  import {formatTime, sum} from 'util/misc.js'
  import {game, cursor} from 'util/state.js'
  import {holes} from 'util/course.js'
  import Card from 'partials/Card'

  let selection = 0
  let scoreInput

  const {timer, done} = getContext('controls')
  const step = cursor(game, ['step'], 'timer')
  const scores = $game.scoreCards.map((_, idx) => cursor(game, ['scoreCards', idx, 'scores']))

  const next = () => {
    timer.stop()
    step.set('scores')
  }

  const setSelection = n => {
    selection = n

    setTimeout(() => scoreInput && scoreInput.focus())
  }

  const addScore = evt => {
    const score = parseInt(evt.target.value)

    // Make sure it stays empty
    evt.target.value = ''

    if (!isNaN(score) && score > 0) {
      scores[selection].update(scores => scores.concat(score))
    }

    if (get(scores[selection]).length === holes.length) {
      setSelection(selection + 1)
    }
  }

  const popScore = cardIdx => {
    scores[cardIdx].update(scores => scores.slice(0, -1))
  }
</script>

{#if $step === 'timer'}
<div class="flex py-20 text-4xl justify-center items-center font-mono">
  <span>{formatTime($timer)}</span>
</div>
<div class="flex justify-center">
  <span class="bg-red-500 rounded py-2 px-4 font-bold text-white cursor-pointer" on:click={next}>
    Stop Timer
  </span>
</div>
{/if}

{#if $step === 'scores'}
<Card>
  <ul>
  {#each $game.scoreCards as card, cardIdx}
    <li
      class="border-l-2 border-solid p-4 my-2 cursor-pointer"
      class:border-red-500={cardIdx === selection}
      class:border-gray-400={cardIdx !== selection}
      on:click={() => setSelection(cardIdx)}>
      <div class="flex justify-between">
        <div class="w-24">{card.player}</div>
        {#if selection === cardIdx && card.scores.length < holes.length}
        <input
          type="number"
          placeholder="Score"
          class="rounded -my-1 px-1 text-gray-900 border-gray-500 border border-solid w-20"
          bind:this={scoreInput}
          on:input={addScore}>
        {/if}
        <div class="text-right w-24">{sum(card.scores)} Throws</div>
      </div>
      <div class="text-right">
        {card.scores.join(', ')}
        {#if card.scores.length > 0}
          <i class="pl-1 fa fa-times text-red-500" on:click={() => popScore(cardIdx)} />
        {/if}
      </div>
    </li>
  {/each}
  </ul>
</Card>
{#if $game.scoreCards.every(({scores}) => scores.length === holes.length)}
<div class="flex justify-center pt-8 pb-10" in:fly>
  <span class="bg-red-500 rounded py-2 px-4 font-bold text-white cursor-pointer" on:click={done}>
    Finish Game
  </span>
</div>
{/if}
{/if}
