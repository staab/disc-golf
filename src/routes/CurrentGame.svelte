<script>
  import {onMount, onDestroy} from 'svelte'
  import {navigate} from 'svelte-routing'
  import {holes} from 'util/config.js'
  import {game, store} from 'util/state.js'
  import {formatTime} from 'util/misc.js'

  let duration = 0
  let durationTimeout
  let error = ''

  if (!$game) {
    navigate('/')
  }

  const setDuration = () => {
    duration = (new Date().valueOf() - $game.start)

    durationTimeout = setTimeout(setDuration, 1000)
  }

  const inc = playerIdx => {
    const currentScore = $store.game.players[playerIdx].scores[$game.step] || 0

    error = ''

    $store.game.players[playerIdx].scores[$game.step] = currentScore + 1
  }

  const dec = playerIdx => {
    const currentScore = $store.game.players[playerIdx].scores[$game.step] || 0

    $store.game.players[playerIdx].scores[$game.step] = Math.max(0, currentScore - 1)
  }

  const prev = () => {
    error = ''

    $store.game.step -= 1
  }

  const checkScores = () => {
    const anythingNotScored = $game.players.some(({scores}) =>
      holes.slice(0, $game.step + 1).some((_, idx) => !scores[idx])
    )

    if (anythingNotScored) {
      error = "Please score all players before continuing"

      return false
    }

    error = ''

    return true
  }

  const next = () => {
    if (checkScores()) {
      $store.game.step += 1
    }
  }

  const discard = () => {
    navigate('/')

    $store.game = null
  }

  const done = () => {
    if (checkScores()) {
      $store.game.end = new Date().valueOf()

      navigate('/scores')
    }
  }

  onMount(() => setDuration())

  onDestroy(() => clearTimeout(durationTimeout))
</script>

<div class="flex justify-between pb-4">
  <div>
    <h1 class="font-bold uppercase">Current Game — 9 Holes</h1>
    <small class="underline cursor-pointer" on:click={discard}>Discard</small>
  </div>
  <span class="font-mono">{formatTime(duration)}</span>
</div>
<table class="mb-4 w-full">
{#each $game.players as player, playerIdx}
  <tr>
    <td>{player.name}</td>
    <td class="text-right">
      {player.scores.reduce((a, b) => a + b, 0)} Throws
    </td>
  </tr>
{/each}
</table>
<div class="mb-4 h-px bg-gray-600" />
<div class="flex justify-between pb-2">
  <td class="font-bold" on:click={() => navigate(`/hole/${$game.step}`)}>
    <i class="fas fa-map-marker-alt text-red-500 cursor-pointer" />
    <span class="pl-2">{holes[$game.step].name}</span>
  </td>
  <span>Par {holes[$game.step].par}</span>
</div>
{#each $game.players as player, playerIdx}
  <div class="flex justify-between pb-4">
    <h2>{player.name}</h2>
    <div class="flex justify-end items-center">
      <i
        class="fas fa-minus-circle text-red-500 cursor-pointer"
        on:click={() => dec(playerIdx)}/>
      <div class="font-mono w-8 text-center">{player.scores[$game.step] || 0}</div>
      <i
        class="fas fa-plus-circle text-red-500 cursor-pointer"
        on:click={() => inc(playerIdx)}/>
    </div>
  </div>
{/each}
<div class="text-red-500 text-center m-4">&nbsp;{error}&nbsp;</div>
<div class="h-12 bg-red-500 fixed shadow bottom-0 left-0 right-0 font-bold w-full">
  <div class="container max-w-xl m-auto relative">
    {#if $game.step > 0}
      <div on:click={prev} class="absolute left-0 p-3 underline cursor-pointer">
        <i class="fas fa-caret-left" />
        {holes[$game.step - 1].name}
      </div>
    {/if}
    <div class="absolute right-0 p-3 underline cursor-pointer">
      {#if $game.step < holes.length - 1}
        <div on:click={next}>
          {holes[$game.step + 1].name}
          <i class="fas fa-caret-right" />
        </div>
      {:else}
        <div on:click={done}>
          Finish Game
        </div>
      {/if}
    </div>
  </div>
</div>
