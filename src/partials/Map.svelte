<script>
  import {onMount} from 'svelte'

  export let callback
  export let view

  let mapElement

  onMount(() => {
    const map = L.map(mapElement).setView([view.lon, view.lat], view.zoom)
    const layer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/outdoors-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: process.env.MAPBOX_TOKEN,
    })

    layer.addTo(map)

    callback(map)
  })
</script>

<div bind:this={mapElement} style="height: 30vh" class="shadow mb-4" />
