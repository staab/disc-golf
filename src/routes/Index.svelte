<script>
  import Card from 'partials/Card'
  import Map from 'partials/Map'

  const view = {lon: 46.7396579, lat: -116.7687484, zoom: 13}
  const buildUrl = subdomain => `https://${subdomain}.${window.location.host}`

  const mapCallback = map => {
    window.courseList.forEach(({subdomain, name, view, holes}) => {
      L.marker([view.lon, view.lat]).addTo(map).bindPopup(`
        <a href="${buildUrl(subdomain)}">${name}</a> — ${holes} holes
      `)
    })
  }
</script>

<Card>
  <p class="mb-4">
    Find a course near you using the map, or browse the list below.
  </p>
  <Map {view} callback={mapCallback} />
</Card>
<Card>
  <ul>
  {#each window.courseList as {subdomain, name, holes, city}}
    <li>
      <a class="text-red-500" href="{buildUrl(subdomain)}">{name}</a> in {city}
      — {holes} holes
    </li>
  {/each}
  </ul>
</Card>
