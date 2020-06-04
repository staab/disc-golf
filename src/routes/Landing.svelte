<script>
  import {Link} from "svelte-routing"
  import {listBest} from 'util/api.js'
  import {view, start, holes} from 'util/course.js'
  import Leaderboard from 'partials/Leaderboard'
  import Card from 'partials/Card'
  import Map from 'partials/Map'

  const bestScores = listBest({limit: 5})

  const mapCallback = map => {
    L.marker([start.lon, start.lat]).addTo(map).bindPopup(`<b>Start</b>`)

    holes.forEach(({name, par, lon, lat}) => {
      const label = `<b>${name}</b><br /><small>Par ${par}</small>`

      L.marker([lon, lat]).addTo(map).bindPopup(label)
    })
  }
</script>
<Card>
  <p class="mb-4">
    Located in Troy, ID this short 9-hole technical course is great
    for skilled players and beginners alike. Holes are all par 3, but
    lots of hills and trees create a fun challenge.
  </p>
  <Map {view} callback={mapCallback} />
  <div class="flex justify-center pt-8 pb-10">
    <Link to="/game/new">
      <span class="bg-red-500 rounded py-2 px-4 font-bold text-white">
        Start Game
      </span>
    </Link>
  </div>
</Card>
<Leaderboard title="Best Speedruns" promise={bestScores} more="/leaders" />
