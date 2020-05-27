<script>
  import {view, holes} from 'util/course.js'
  import Map from 'partials/Map'
  import Card from 'partials/Card'

  export let id

  const hole = holes[id]
  const mapCallback = map => {
    const label = `<b>${name}</b><br /><small>Par ${hole.par}</small>`

    L.marker([hole.lon, hole.lat]).addTo(map).bindPopup(label)
  }
</script>

<div class="flex justify-between pb-4">
  <h2 class="font-bold uppercase">{hole.name}</h2>
  <span>Par {hole.par}</span>
</div>
<Card>
  <Map {view} callback={mapCallback} />
</Card>
