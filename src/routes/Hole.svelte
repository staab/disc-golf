<script>
  import {view, holes} from 'util/config.js'
  import Map from 'partials/Map'

  export let id

  const hole = holes[id]
  const mapCallback = map => {
    const label = `<b>${name}</b><br /><small>Par ${hole.par}</small>`

    L.marker([hole.lon, hole.lat]).addTo(map).bindPopup(label)
  }
</script>

<h1 class="font-bold uppercase pb-2">{hole.name}</h1>
<div class="pb-2">Par {hole.par}</div>
<Map {view} callback={mapCallback} />
