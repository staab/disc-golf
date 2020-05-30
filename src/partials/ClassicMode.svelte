<script>
  import {getContext} from 'svelte'
  import {get} from 'svelte/store'
  import {game, cursor} from 'util/state.js'
  import {holes} from 'util/course.js'
  import Card from 'partials/Card'

  const step = cursor(game, ['step'], 0)
  const controls = getContext('controls')

  const calculateError = () => {
    const anythingNotScored = $game.scoreCards.some(({scores}) =>
      holes.slice(0, $step + 1).some((_, idx) => !scores[idx])
    )

    if (anythingNotScored) {
      controls.error.set("Please score all players before continuing")
    }
  }

  const inc = card =>
    controls.setScore(card, $step, controls.getScore(card, $step) + 1)

  const dec = card =>
    controls.setScore(card, $step, Math.max(0, controls.getScore(card, $step) - 1))

  const prev = () => {
    $step -= 1

    controls.error.set('')
  }

  const next = () => {
    calculateError()

    if (!get(controls.error)) {
      $step += 1
    }
  }
</script>

<table class="mb-4 w-full">
{#each $game.scoreCards as card, cardIdx}
  <tr>
    <td>{card.player}</td>
    <td class="text-right">
      {card.scores.reduce((a, b) => a + b, 0)} Throws
    </td>
  </tr>
{/each}
</table>
<Card>
  <div class="flex justify-between pb-2">
    <td class="font-bold" on:click={() => navigate(`/hole/${$step}`)}>
      <i class="fas fa-map-marker-alt text-red-500 cursor-pointer" />
      <span class="pl-2">{holes[$step].name}</span>
    </td>
    <span>Par {holes[$step].par}</span>
  </div>
  {#each $game.scoreCards as card, cardIdx}
    <div class="flex justify-between py-4 text-2xl">
      <h3>{card.player}</h3>
      <div class="flex justify-end items-center">
        <i
          class="fas fa-minus-circle text-red-500 cursor-pointer"
          on:click={() => dec(cardIdx)}/>
        <div class="font-mono w-8 text-center">{card.scores[$step] || 0}</div>
        <i
          class="fas fa-plus-circle text-red-500 cursor-pointer"
          on:click={() => inc(cardIdx)}/>
      </div>
    </div>
  {/each}
</Card>
<div class="h-12 bg-red-500 fixed shadow bottom-0 left-0 right-0 font-bold w-full text-white">
  <div class="container max-w-xl m-auto relative">
    {#if $step > 0}
      <div on:click={prev} class="absolute left-0 p-3 underline cursor-pointer">
        <i class="fas fa-caret-left" />
        {holes[$step - 1].name}
      </div>
    {/if}
    <div class="absolute right-0 p-3 underline cursor-pointer">
      {#if $step < holes.length - 1}
        <div on:click={next}>
          {holes[$step + 1].name}
          <i class="fas fa-caret-right" />
        </div>
      {:else}
        <div on:click={controls.done}>
          Finish Game
        </div>
      {/if}
    </div>
  </div>
</div>
