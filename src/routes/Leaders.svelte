<script>
  import {Link} from "svelte-routing"
  import {listBest} from 'util/api.js'
  import Leaderboard from 'partials/Leaderboard'

  const bestScores = listBest({limit: 50})
</script>
<Leaderboard title="Best Speedruns" promise={bestScores} />
{#await bestScores}
<span />
{:then}
<div class="flex justify-center pt-8 pb-10">
  <Link to="/">
    <span class="bg-red-500 rounded py-2 px-4 font-bold text-white">
      Back Home
    </span>
  </Link>
</div>
{/await}
