<script>
  import {Link} from "svelte-routing"
  import {listBestScores, listBestTimes} from 'util/api.js'
  import Leaderboard from 'partials/Leaderboard'

  const bestScores = listBestScores({limit: 50})
  const bestTimes = listBestTimes({limit: 50})
</script>
<Leaderboard title="Best Scores" promise={bestScores} />
<Leaderboard title="Fastest Times" promise={bestTimes} />
<div class="flex justify-center pt-8 pb-10">
  <Link to="/">
    <span class="bg-red-500 rounded py-2 px-4 font-bold">
      Back Home
    </span>
  </Link>
</div>
