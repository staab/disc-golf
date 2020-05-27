<script>
  import {holes} from 'util/course.js'
  import {sum, prop, formatScore} from 'util/misc.js'

  export let scoreCards

  const totalPar = sum(holes.map(prop('par')))
</script>

<style>
  th, td {
    padding: 0.5rem;
    white-space: nowrap;
    font-size: 0.9em;
  }

  .players th:first-child,
  .players td:first-child {
    padding-left: 0;
  }

  .scores th:last-child,
  .scores td:last-child {
    padding-right: 0;
  }
</style>

<div class="flex relative">
  <table class="players border-gray-300 border-solid border-r">
    <tr>
      <th class="font-bold">Player</th>
    </tr>
    {#each scoreCards as scoreCard, idx}
      <tr>
        <td class="border-gray-300 border-solid border-t">
          {scoreCard.player}
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
      {#each scoreCards as scoreCard, idx}
        <tr class="border-gray-300 border-solid border-t">
          <td class="text-right">{formatScore(sum(scoreCard.scores), totalPar)}</td>
          {#each holes as hole, idx}
            <td class="text-right">{formatScore(scoreCard.scores[idx], hole.par)}</td>
          {/each}
        </tr>
      {/each}
    </table>
  </div>
</div>
