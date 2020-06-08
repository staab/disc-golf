<script>
  import {Link} from 'svelte-routing'
  import {holes} from 'util/course.js'
  import {sum, log, prop, formatTime, formatScore} from 'util/misc.js'
  import Card from 'partials/Card'

  export let more
  export let title
  export let promise

  const par = sum(holes.map(prop('par')))
</script>

{#await promise}
<span />
{:then scoreCards}
<div class="flex justify-between my-4">
  <h2 class="font-bold uppercase">{title}</h2>
  <span>
    <i class="fas fa-calendar-alt" />
    Last 30 days
  </span>
</div>
<Card>
  <div class="mb-4 p-2 pl-4 border-l-2 border-solid border-red-500 text-sm">
    Scores are calculated as number of seconds in speedrun + 20 seconds for each throw.
  </div>
  <table class="w-full mb-2 text-sm">
    <tr>
      <th class="p-2 pl-0 text-left">Player</th>
      <th class="p-2 text-right">Time</th>
      <th class="p-2 text-right">Throws</th>
      <th class="p-2 pr-0 text-right">Score</th>
      <th></th>
    </tr>
    {#each scoreCards as scoreCard, idx}
    <tr class="border-gray-600 border-solid" class:border-t={idx > 0}>
      <td class="p-2 pl-0">{scoreCard.player}</td>
      <td class="p-2 text-right">{formatTime(scoreCard.duration)}</td>
      <td class="p-2 text-right">{formatScore(scoreCard.score, par)}</td>
      <td class="p-2 text-right">{scoreCard.compositeScore}</td>
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
  {#if more}
  <div class="flex justify-center pb-2 underline">
    <Link to="/leaders">More</Link>
  </div>
  {/if}
</Card>
{:catch error}
<Card>
  We aren't able to load the leaderboards right now.
</Card>
{/await}
