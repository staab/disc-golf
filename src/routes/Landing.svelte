<script>
  import {onMount} from 'svelte'

  const view = {lon: 46.7396579, lat: -116.7687484, zoom: 17}
  const holes = [
    {name: 'Start', lon: 46.739667, lat: -116.768900},
    {name: 'Hole #1', lon: 46.740005, lat: -116.768771, par: 3},
    {name: 'Hole #2', lon: 46.740444, lat: -116.769297, par: 3},
    {name: 'Hole #3', lon: 46.739791, lat: -116.769158, par: 3},
    {name: 'Hole #4', lon: 46.739784, lat: -116.769466, par: 3},
    {name: 'Hole #5', lon: 46.739364, lat: -116.769664, par: 3},
    {name: 'Hole #6', lon: 46.738950, lat: -116.769490, par: 3},
    {name: 'Hole #7', lon: 46.738939, lat: -116.769194, par: 3},
    {name: 'Hole #8', lon: 46.738858, lat: -116.768961, par: 3},
    {name: 'Hole #9', lon: 46.739397, lat: -116.768877, par: 3},
  ]

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

    holes.forEach(({name, par, lon, lat}) => {
      let label = `<b>${name}</b>`

      if (par) {
        label += `<br /><small>Par ${par}</small>`
      }

      L.marker([lon, lat]).addTo(map).bindPopup(label)
    })
  })
</script>
<p class="pb-4">
  Located in Troy, ID this short 9-hole technical course is great
  for skilled players and beginners alike. Holes are all par 3, but
  lots of hills and trees create a fun challenge.
</p>
<div bind:this={mapElement} style="height: 30vh" class="border border-solid border-gray-600" />
