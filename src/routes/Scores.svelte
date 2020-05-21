<script>
  import {onMount, onDestroy} from 'svelte'
  import {navigate, Link} from 'svelte-routing'
  import {holes} from 'util/config.js'
  import {store, game} from 'util/state.js'
  import {sum, prop, formatTime, formatScore} from 'util/misc.js'
  import {Game, Score} from 'util/api.js'

  if (!$game) {
    navigate('/')
  }

  const duration = $game.end - $game.start
  const totalPar = sum(holes.map(prop('par')))

  const submitScores = () => {
    Game.save({
      id: $game.id,
      end: $game.end,
      start: $game.start,
      course: $game.course,
    })

    Score.bulkCreate($game.players.map(player  => ({
      game: $game.id,
      player: player.name,
      score: sum(player.scores),
      scores: player.scores,
      duration,
    })))

    navigate('/next')

    $store.game = null
  }
</script>

<style>
  th, td {
    padding: 0.5rem;
    white-space: nowrap;
    font-size: 0.9em;
  }

  .players th:first-child, td:first-child {
    padding-left: 0;
  }

  .scores th:last-child, td:last-child {
    padding-right: 0;
  }
</style>

<div class="flex justify-between pb-4">
  <h2 class="font-bold uppercase">Game Summary</h2>
  <span class="font-mono">{formatTime(duration)}</span>
</div>

<div class="flex relative">
  <table class="players border-gray-600 border-solid border-r">
    <tr>
      <th class="font-bold">Player</th>
    </tr>
    {#each $game.players as player, idx}
      <tr>
        <td class="border-gray-600 border-solid" class:border-t={idx > 0}>
          {player.name}
        </td>
      </tr>
    {/each}
  </table>
  <div class="overflow-auto">
    <table class="scores">
      <tr>
        <th class="font-bold text-right">Total</th>
        {#each holes as hole}
          <th class="font-bold text-right">{hole.name}</th>
        {/each}
      </tr>
      {#each $game.players as player, idx}
        <tr class="border-gray-600 border-solid" class:border-t={idx > 0}>
          <td class="text-right">{formatScore(sum(player.scores), totalPar)}</td>
          {#each holes as hole, idx}
            <td class="text-right">{formatScore(player.scores[idx], hole.par)}</td>
          {/each}
        </tr>
      {/each}
    </table>
  </div>
</div>
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
