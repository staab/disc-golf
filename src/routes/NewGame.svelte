<script>
  import {onMount} from 'svelte'
  import {navigate} from "svelte-routing"
  import {name} from 'util/course.js'
  import {players, store, cursor} from "util/state.js"
  import Card from 'partials/Card'

  let error = ''

  const addPlayer = () => {
    error = ""
    $store.players = $players.concat({name: '', id: Math.random()})
  }

  const removePlayer = idx => {
    error = ""
    $store.players = $players.filter((_, i) => i !== idx)
  }

  const startGame = () => {
    if ($players.find(({name}) => !name)) {
      error = "Please enter names for all players"

      return
    }

    $store.game = {
      course: name,
      duration: 0,
      startTime: new Date().valueOf(),
      id: Math.random().toString().slice(2),
      scoreCards: $players.map(({name}) => ({player: name, scores: []})),
    }

    navigate('/game/current')
  }

  onMount(() => {
    if ($players.length === 0) {
      addPlayer()
    }
  })
</script>

<h2 class="font-bold uppercase pb-4">New Game — 9 Holes</h2>
<Card>
  <div class="pb-2">Players</div>
  <div class="pb-2">
    {#each $players as player, idx (player.id)}
      <div class="pb-1">
        <input
          class="rounded px-3 py-2 text-gray-900 border-gray-500 border border-solid"
          type="text"
          placeholder="Enter Player Name"
          value={player.name}
          on:change={evt => {$store.players[idx].name = evt.target.value}}
          on:input={() => {error = ""}}>
        {#if idx > 0}
          <span class="-ml-8 sm:ml-2 cursor-pointer" on:click={() => removePlayer(idx)}>
            <i class="fas fa-times" />
            <span class="pl-1 text-underline hidden sm:inline">Remove Player</span>
          </span>
        {/if}
      </div>
    {/each}
  </div>
  <div on:click={addPlayer} class="cursor-pointer pb-2">
    <i class="fas fa-plus" />
    <span class="text-underline">Add Player</span>
  </div>
</Card>
<div class="text-red-500">&nbsp;{error}&nbsp;</div>
<div class="flex justify-center pt-8 pb-10">
  <button class="text-white bg-red-500 rounded py-2 px-4 font-bold" on:click={startGame}>
    Start Game
  </button>
</div>
