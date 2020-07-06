<script>
  import {onMount, onDestroy} from 'svelte'
  import {Link} from 'svelte-routing'
  import {fly} from 'svelte/transition'
  import {writable, get} from 'svelte/store'
  import {navigate} from 'svelte-routing'
  import {holes} from 'util/course.js'
  import {game, store, cursor} from 'util/state.js'
  import {formatTime, formatScore, sum} from 'util/misc.js'
  import {Game, ScoreCard} from 'util/api.js'
  import Card from 'partials/Card'

  // Track time

  let lastStart
  let savedDuration

  const startTimer = () => {
    editedTime = null
    lastStart = new Date().valueOf()
    savedDuration = $game.duration

    ;(function tick() {
      if (!lastStart) {
        return
      }

      const now = new Date().valueOf()

      $game.duration = savedDuration + now - lastStart

      // Keep focus on the invisible score input
      if (scoreInput && scoreInput !== document.activeElement) {
        scoreInput.focus()
      }

      requestAnimationFrame(tick)
    }())
  }

  const stopTimer = () => {
    lastStart = null
  }

  // Edit time

  let timeInput
  let editedTime = null
  let shouldResume

  const editTime = () => {
    shouldResume = Boolean(lastStart)
    editedTime = formatTime($game.duration)

    stopTimer()
    setTimeout(() => timeInput.select())
  }

  const saveTime = () => {
    const matches = editedTime.match(/^(\d+):([0-5]\d)\.?(\d{1,2})?$/)

    if (!matches) {
      return alert("Please enter your time in this format: mm:ss")
    }

    const [m, s, cs] = matches.slice(1).map(x => parseInt(x, 10))

    editedTime = null
    $game.duration = m * 60 * 1000 + s * 1000 + (cs || 0) * 10

    if (shouldResume) {
      startTimer()
    }

    // Put focus back on the score input
    setSelection(selectedCard)
  }

  // Score editing

  let scoreInput
  let selectedCard = 0

  const scores = $game.scoreCards.map((_, idx) => cursor(game, ['scoreCards', idx, 'scores']))

  const setSelection = n => {
    selectedCard = n

    setTimeout(() => scoreInput && scoreInput.focus())
  }

  const handleKeyDown = evt => {
    if (evt.key === 'Backspace') {
      popScore(selectedCard)
    }
  }

  const addScore = evt => {
    const score = parseInt(evt.target.value)

    // Make sure it stays empty
    evt.target.value = ''

    if (!isNaN(score) && score > 0) {
      scores[selectedCard].update(scores => scores.concat(score))
    }

    if (get(scores[selectedCard]).length === holes.length) {
      setSelection(selectedCard + 1)
    }
  }

  const popScore = cardIdx => {
    scores[cardIdx].update(scores => scores.slice(0, -1))
  }

  const getScore = (cardIdx, step) =>
    $store.game.scoreCards[cardIdx].scores[step] || 0

  const setScore = (cardIdx, step, value) => {
    $store.game.scoreCards[cardIdx].scores[step] = value
  }

  const showScoreSoFar = scores => {
    let total = 0
    let totalPar = 0

    for (let i in scores) {
      if (!scores[i]) {
        break
      }

      total += scores[i]
      totalPar += holes[i].par
    }

    return formatScore(total, totalPar)
  }

  // Game control

  const discard = () => {
    if (confirm("Are you sure you want to discard this game?")) {
      navigate('/')

      setTimeout(() => {
        $store.game = null
      })
    }
  }

  const calcScore = (time, score) => Math.round((time + score * 20000) / 1000)

  const submitScores = async () => {
    if (!window.avoidSideEffects) {
      await Promise.all([
        Game.save({
          id: $game.id,
          course: $game.course,
          duration: $game.duration,
        }),
        ScoreCard.bulkCreate(
          $game.scoreCards.map(({player, scores}) => ({
            player,
            game: $game.id,
            score: sum(scores),
            scores: JSON.stringify(scores),
            duration: $game.duration,
            compositeScore: calcScore($game.duration, sum(scores)),
          }))
        ),
      ])
    }

    navigate('/game/complete')

    $store.prevGame = $store.game
    $store.game = null
  }

  onMount(() => startTimer())
  onDestroy(() => stopTimer())
</script>

<div class="flex justify-between">
  <h2 class="font-bold uppercase">Current Game — 9 Holes</h2>
  {#if editedTime}
  <div class="font-mono">
    <input
      type="text"
      class="rounded text-gray-900 border-gray-500 border border-solid text-right"
      style="height: 24px; padding-right: 1px; width: 100px;"
      bind:this={timeInput}
      bind:value={editedTime} />
    <i class="fa fa-check text-red-500 cursor-pointer" on:click={saveTime} />
  </div>
  {:else}
  <span class="font-mono cursor-pointer" on:click={editTime}>
    {formatTime($game.duration)}
    <i class="fa fa-edit text-red-500" />
  </span>
  {/if}
</div>

<small class="block underline cursor-pointer pb-4" on:click={discard}>
  Discard Game
</small>

<Card>
  <small class="block text-gray-600">
    To enter scores, tap on a player's name.
  </small>
  <ul>
  {#each $game.scoreCards as card, cardIdx}
    <li
      class="border-l-2 border-solid p-4 my-2 cursor-pointer"
      class:border-red-500={cardIdx === selectedCard}
      class:border-gray-400={cardIdx !== selectedCard}
      on:click={() => setSelection(cardIdx)}>
      <div class="flex justify-between">
        <div class="w-24">{card.player}</div>
        {#if selectedCard === cardIdx && card.scores.length < holes.length}
        <input
          type="number"
          placeholder="Score"
          class="w-0 score-input"
          bind:this={scoreInput}
          on:input={addScore}
          on:keydown={handleKeyDown}
          on:blur={function() {
            if (!editedTime) {
              this.focus()
            }
          }}>
        {/if}
        <div class="text-right w-24 whitespace-no-wrap">{showScoreSoFar(card.scores)}</div>
      </div>
      <div class="text-right font-mono text-sm">
        {holes.map((_, i) => card.scores[i] || 0).join(', ')}
        <i class="pl-1 fa fa-times text-red-500" on:click={() => popScore(cardIdx)} />
      </div>
    </li>
  {/each}
  </ul>
</Card>

<div class="flex justify-center pt-8 pb-10" in:fly>
{#if !lastStart && !editedTime && $game.scoreCards.every(({scores}) => scores.length === holes.length)}
  <div>
    <div
      class="bg-red-500 rounded py-2 px-4 font-bold text-white cursor-pointer"
      on:click={submitScores}>
      Submit Scores
    </div>
    <div class="text-sm text-center pt-1">
      Or, <span class="underline cursor-pointer"><Link to="/">Go Home</Link></span>
    </div>
  </div>
{:else}
  <span
    class="bg-white rounded py-2 px-4 font-bold cursor-pointer border border-gray-500 border-solid"
    on:click={() => lastStart ? stopTimer() : startTimer()}>
    {lastStart ? 'Stop Timer' : 'Resume Timer'}
  </span>
{/if}
</div>
