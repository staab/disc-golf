<script>
  import {onMount, onDestroy, setContext} from 'svelte'
  import {writable} from 'svelte/store'
  import {navigate} from 'svelte-routing'
  import {holes} from 'util/course.js'
  import {game, store, cursor, Timer} from 'util/state.js'
  import {formatTime} from 'util/misc.js'
  import SpeedMode from 'partials/SpeedMode'

  const timer = new Timer()
  const error = writable('')

  const controls = {
    error,
    timer,
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
        $store.game.duration = $timer.elapsed

        navigate('/game/submit')
      }
    },
  }

  setContext('controls', controls)

  onMount(() => timer.start($game.startTime))
  onDestroy(() => timer.stop())
</script>

<div class="flex justify-between">
  <h2 class="font-bold uppercase">Current Game — 9 Holes</h2>
  <span class="font-mono">{formatTime($timer.elapsed)}</span>
</div>
<small class="block underline cursor-pointer pb-4" on:click={controls.discard}>
  Discard Game
</small>
<SpeedMode />
<div class="text-red-500 text-center p-10">&nbsp;{$error}&nbsp;</div>
