<script>
  import {Link} from 'svelte-routing'
  import {blur} from 'svelte/transition'
  import {findGame, findScoresByGame} from 'util/api.js'
  import {formatTime} from 'util/misc.js'
  import ScoreCards from 'partials/ScoreCards'
  import Card from 'partials/Card'

  export let id

  const promise = Promise.all([findGame(id), findScoresByGame(id)])
</script>

{#await promise}
<span />
{:then [game, scoreCards]}
<div class="flex justify-between pb-4">
  <div>
    <h2 class="font-bold uppercase">Game at {game.course}</h2>
    <small>on {new Date(game.created).toLocaleDateString()}</small>
  </div>
  <span class="font-mono">{formatTime(game.end - game.start)}</span>
</div>
<Card>
  <ScoreCards scoreCards={scoreCards} />
</Card>
{:catch error}
We weren't able to load this game, please go back and try again.
{/await}

{#await promise}
<span />
{:then}
<div class="flex justify-center pt-8 pb-10" in:blur>
  <Link to="/">
    <span class="bg-red-500 rounded py-2 px-4 font-bold text-white">
      Back Home
    </span>
  </Link>
</div>
{/await}
