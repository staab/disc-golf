<script>
  import {onMount} from 'svelte'
  import {navigate} from "svelte-routing"
  import {players, store} from "util/state.js"

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
      id: Math.random().toString().slice(2),
      step: 0,
      end: null,
      start: new Date().valueOf(),
      course: 'duthie-park',
      players: $players.map(player => ({...player, scores: []})),
    }

    navigate('/game')
  }

  onMount(() => {
    if ($players.length === 0) {
      addPlayer()
    }
  })
</script>

<h2 class="font-bold uppercase pb-4">New Game — 9 Holes</h2>
<div class="pb-2">Players</div>
<div class="pb-2">
  {#each $players as player, idx (player.id)}
    <div class="pb-1">
      <input
        class="rounded px-3 py-2 text-gray-900"
        type="text"
        placeholder="Enter Player Name"
        bind:value={player.name}
        on:input={() => {error = ""}}>
      {#if idx > 0}
        <span class="pl-2 cursor-pointer" on:click={() => removePlayer(idx)}>
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
<div class="text-red-500">&nbsp;{error}&nbsp;</div>
<div class="flex justify-center pt-8 pb-10">
  <button class="bg-red-500 rounded py-2 px-4 font-bold" on:click={startGame}>
    Start Game
  </button>
</div>
