<script>
  import {Link} from 'svelte-routing'
  import {holes} from 'util/config.js'
  import {sum, prop, formatTime, formatScore} from 'util/misc.js'

  export let title
  export let promise

  const par = sum(holes.map(prop('par')))
</script>

{#await promise}
<span />
{:then scoreCards}
<div class="flex justify-between mb-2">
  <h2 class="font-bold uppercase">{title}</h2>
  <span>
    <i class="fas fa-calendar-alt" />
    Last 30 days
  </span>
</div>
<table class="w-full mb-2">
  {#each scoreCards as scoreCard, idx}
  <tr class="border-gray-600 border-solid" class:border-t={idx > 0}>
    <td class="p-2 pl-0">{scoreCard.player}</td>
    <td class="p-2 text-right">{formatTime(scoreCard.duration)}</td>
    <td class="p-2 text-right">{formatScore(scoreCard.score, par)}</td>
    <td class="p-2 pr-0 text-right">
      <Link to="/game/{scoreCard.game}">
        <i class="fas fa-expand-arrows-alt text-red-500" />
      </Link>
    </td>
  </tr>
  {:else}
  <tr>
    <td>No games in the last 30 days</td>
  </tr>
  {/each}
</table>
{:catch error}
We aren't able to load the leaderboards right now.
{/await}
