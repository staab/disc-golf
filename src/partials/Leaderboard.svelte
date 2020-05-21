<script>
  import {holes} from 'util/config.js'
  import {sum, prop, formatTime, formatScore} from 'util/misc.js'

  export let title
  export let promise

  const par = sum(holes.map(prop('par')))
</script>

{#await promise}
<span />
{:then scores}
<div class="flex justify-between mb-2">
  <h2 class="font-bold uppercase">{title}</h2>
  <span>
    <i class="fas fa-calendar-alt" />
    Last 30 days
  </span>
</div>
<table class="w-full mb-2">
  {#each scores as score, idx}
  <tr class="border-gray-600 border-solid" class:border-t={idx > 0}>
    <td class="p-2 pl-0">{score.player}</td>
    <td class="p-2 text-right">{formatTime(score.duration)}</td>
    <td class="p-2 pr-0 text-right">{formatScore(score.score, par)}</td>
  </tr>
  {:else}
  <tr>
    <td>No scores in the last 30 days</td>
  </tr>
  {/each}
</table>
{/await}
