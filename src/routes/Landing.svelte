<script>
  import {onMount} from 'svelte'
  import {Link} from "svelte-routing"
  import {listBestScores, listBestTimes} from 'util/api.js'
  import {view, start, holes} from 'util/config.js'
  import Leaderboard from 'partials/Leaderboard'
  import Map from 'partials/Map'

  const bestScores = listBestScores()
  const bestTimes = listBestTimes()

  const mapCallback = map => {
    L.marker([start.lon, start.lat]).addTo(map).bindPopup(`<b>Start</b>`)

    holes.forEach(({name, par, lon, lat}) => {
      const label = `<b>${name}</b><br /><small>Par ${par}</small>`

      L.marker([lon, lat]).addTo(map).bindPopup(label)
    })
  }
</script>
<p class="mb-4">
  Located in Troy, ID this short 9-hole technical course is great
  for skilled players and beginners alike. Holes are all par 3, but
  lots of hills and trees create a fun challenge.
</p>
<Map {view} callback={mapCallback} />
<div class="flex justify-center pt-8 pb-10">
  <Link to="/new">
    <button class="bg-red-500 rounded py-2 px-4 font-bold">
      Start Game
    </button>
  </Link>
</div>
<Leaderboard title="Best Scores" promise={bestScores} />
<Leaderboard title="Fastest Times" promise={bestTimes} />
