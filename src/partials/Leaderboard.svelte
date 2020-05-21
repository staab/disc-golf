<script>
  export let title
  export let promise

  const par = 27

  const formatScore = ({score}) => {
    const sign = score >= par ? "+" : "-"
    const diff = Math.abs(score - par)

    return `${score} (${sign}${diff})`
  }
</script>

{#await promise}
<span />
{:then scores}
<div class="flex justify-between mb-2">
  <h2 class="font-bold">{title}</h2>
  <span>
    <i class="fas fa-calendar-alt" />
    Last 30 days
  </span>
</div>
<table class="w-full mb-4">
  {#each scores as score}
  <tr>
    <td>{score.player}</td>
    <td class="text-right">{score.time}</td>
    <td class="text-right">{formatScore(score)}</td>
  </tr>
  {:else}
  <tr>
    <td>No scores in the last 30 days</td>
  </tr>
  {/each}
</table>
{/await}
