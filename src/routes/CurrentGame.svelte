<script>
  import {onMount, onDestroy} from 'svelte'
  import {navigate} from 'svelte-routing'
  import {holes} from 'util/config.js'
  import {getState, setState} from 'util/state.js'
  import {formatTime} from 'util/misc.js'

  let duration = 0
  let durationTimeout
  let error = ''
  let {players, start, holeIdx} = getState()

  if (!players) {
    navigate('/')
  }

  const setDuration = () => {
    duration = (new Date().valueOf() - start) / 1000

    durationTimeout = setTimeout(setDuration, 1000)
  }

  const inc = playerIdx => {
    const currentScore = players[playerIdx].scores[holeIdx] || 0

    error = ''

    players[playerIdx].scores[holeIdx] = currentScore + 1
    players = players

    setState({players})
  }

  const dec = playerIdx => {
    const currentScore = players[playerIdx].scores[holeIdx] || 0

    players[playerIdx].scores[holeIdx] = Math.max(0, currentScore - 1)
    players = players

    setState({players})
  }

  const prev = () => {
    holeIdx -= 1

    error = ''

    setState({holeIdx})
  }

  const checkScores = () => {
    const anythingNotScored = players.some(({scores}) =>
      holes.slice(0, holeIdx + 1).some((_, idx) => !scores[idx])
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
      holeIdx += 1

      setState({holeIdx})
    }
  }

  const done = () => {
    if (checkScores()) {
      navigate('/scores')
    }
  }

  onMount(() => setDuration())

  onDestroy(() => clearTimeout(durationTimeout))
</script>

<div class="flex justify-between pb-4">
  <h1 class="font-bold uppercase">Current Game — 9 Holes</h1>
  <span class="font-mono">{formatTime(duration)}</span>
</div>
<table class="mb-4 w-full">
{#each players as player, playerIdx}
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
  <td class="font-bold" on:click={() => navigate(`/hole/${holeIdx}`)}>
    <i class="fas fa-map-marker text-red-500 cursor-pointer" />
    <span class="pl-2">{holes[holeIdx].name}</span>
  </td>
  <span>Par {holes[holeIdx].par}</span>
</div>
{#each players as player, playerIdx}
  <div class="flex justify-between pb-4">
    <h2>{player.name}</h2>
    <div class="flex justify-end items-center">
      <i
        class="fas fa-minus-circle text-red-500 cursor-pointer"
        on:click={() => dec(playerIdx)}/>
      <div class="font-mono w-8 text-center">{player.scores[holeIdx] || 0}</div>
      <i
        class="fas fa-plus-circle text-red-500 cursor-pointer"
        on:click={() => inc(playerIdx, holeIdx)}/>
    </div>
  </div>
{/each}
<div class="text-red-500 text-center m-4">&nbsp;{error}&nbsp;</div>
<div class="h-12 bg-red-500 fixed shadow bottom-0 left-0 right-0 font-bold w-full">
  <div class="container m-auto relative">
    {#if holeIdx > 0}
      <div on:click={prev} class="absolute left-0 p-3 underline cursor-pointer">
        <i class="fas fa-caret-left" />
        {holes[holeIdx - 1].name}
      </div>
    {/if}
    <div class="absolute right-0 p-3 underline cursor-pointer">
      {#if holeIdx < holes.length - 1}
        <div on:click={next}>
          {holes[holeIdx + 1].name}
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
