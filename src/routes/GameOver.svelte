<script>
  import {onMount} from 'svelte'
  import {Link} from 'svelte-routing'
  import Card from 'partials/Card'
  import {installPrompt, store} from 'util/state.js'
  import Ad from 'util/advertise.js'

  const ad = new Ad($store.prevGame)

  onMount(() => $installPrompt && $installPrompt.prompt())
</script>

<h2 class="text-bold py-4 font-bold">Your scores have been submitted!</h2>
<div class="mb-4 p-2 pl-4 border-l-2 border-solid border-red-500">
  {@html ad.getText()}
</div>
<Card>
  <div class="flex flex-col">
    <div class="py-2">
      <Link to="/game/new">
        <i class="fas fa-paper-plane" />
        <span class="pl-1 underline">Start a new Game</span>
      </Link>
    </div>
    <div class="py-2">
      <Link to="/leaders">
        <i class="fas fa-list-ol" />
        <span class="pl-1 underline">View Leaderboard</span>
      </Link>
    </div>
    <div class="py-2">
      <Link to="/">
        <i class="fas fa-home" />
        <span class="pl-1 underline">Back Home</span>
      </Link>
    </div>
  </div>
</Card>
