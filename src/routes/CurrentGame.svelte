<script>
  import {onMount, onDestroy, setContext} from 'svelte'
  import {writable} from 'svelte/store'
  import {navigate} from 'svelte-routing'
  import {holes} from 'util/course.js'
  import {game, store, cursor} from 'util/state.js'
  import {formatTime, Timer} from 'util/misc.js'
  import SpeedMode from 'partials/SpeedMode'
  import ClassicMode from 'partials/ClassicMode'
  import ManualMode from 'partials/ManualMode'

  const timer = new Timer()
  const error = writable('')

  const controls = {
    error,
    getScore(card, step) {
      return $store.game.scoreCards[card].scores[step] || 0
    },
    setScore(card, step, value) {
      $store.game.scoreCards[card].scores[step] = value

      error.set('')
    },
    discard: () => {
      if (confirm("Are you sure you want to discard this game?")) {
        navigate('/')

        setTimeout(() => {
          $store.game = null
        })
      }
    },
    done: () => {
      if (!$error) {
        $store.game.duration = $timer

        navigate('/game/submit')
      }
    },
  }

  setContext('controls', controls)

  onMount(() => timer.start($game.started))
  onDestroy(() => timer.stop())
</script>

<div class="flex justify-between pb-4">
  <h2 class="font-bold uppercase">Current Game — 9 Holes</h2>
  <span class="font-mono">{formatTime($timer)}</span>
</div>
{#if $game.mode === "speedrun"}
<SpeedMode />
{:else if $game.mode === "classic"}
<ClassicMode />
{:else if $game.mode === "manual"}
<ClassicMode />
{/if}
<div>
  <small class="underline cursor-pointer" on:click={controls.discard}>
    Discard Game
  </small>
</div>
<div class="text-red-500 text-center p-10">&nbsp;{$error}&nbsp;</div>
