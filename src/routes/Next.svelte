<script>
  import {Link} from 'svelte-routing'
</script>

<h2 class="text-bold my-4 font-bold">Your scores have been submitted!</h2>
<div class="flex flex-col">
  <Link to="/new">
    <i class="fas fa-paper-plane" />
    <span class="pl-1 underline">Start a new Game</span>
  </Link>
  <Link to="/leaders">
    <i class="fas fa-list-ol" />
    <span class="pl-1 underline">View Leaderboard</span>
  </Link>
  <Link to="/">
    <i class="fas fa-home" />
    <span class="pl-1 underline">Back Home</span>
  </Link>
</div>
