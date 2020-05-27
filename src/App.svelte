<script>
  import {Router, Route, Link} from "svelte-routing"
  import Landing from 'routes/Landing'
  import NewGame from 'routes/NewGame'
  import CurrentGame from 'routes/CurrentGame'
  import SubmitScores from 'routes/SubmitScores'
  import GameOver from 'routes/GameOver'
  import ViewGame from 'routes/ViewGame'
  import Leaders from 'routes/Leaders'
  import Hole from 'routes/Hole'
  import {name} from 'util/course.js'
  import {game} from 'util/state.js'

  export let url = "";

	let sideNavIsOpen = false

	const openSideNav = evt => {
  	evt.stopPropagation()

  	sideNavIsOpen = !sideNavIsOpen
	}

	const closeSideNav = () => {
  	sideNavIsOpen = false
	}
</script>

<style>
  .top-nav {
    z-index: 9999;
  }

  .side-nav {
    z-index: 9999;
    pointer-events: none;
  }

  .side-nav > ul {
    width: 240px;
    max-width: 240px;
    margin-left: -240px;
    transition: margin-left 200ms;
    pointer-events: all;
  }

  .side-nav-open > ul {
    margin-left: 0;
  }
</style>

<main
  class="bg-gray-700 inset-0 absolute text-white overflow-auto"
  on:click={closeSideNav}>
  <div class="h-10 bg-red-500 p-2 fixed w-full shadow top-nav">
    <div class="container max-w-xl m-auto sm:px-3">
      <i class="fas fa-bars absolute pt-1 cursor-pointer" on:click={openSideNav} />
      <h1 class="text-center">{name}</h1>
    </div>
  </div>
  <Router {url}>
    <div class="container max-w-xl m-auto mt-10 p-3">
      <Route path="game/new" component={NewGame} />
      <Route path="game/current" component={CurrentGame} />
      <Route path="game/submit" component={SubmitScores} />
      <Route path="game/complete" component={GameOver} />
      <Route path="game/:id" component={ViewGame} />
      <Route path="leaders" component={Leaders} />
      <Route path="hole/:id" component={Hole} />
      <Route path="*"><Landing /></Route>
    </div>
    <div class="side-nav h-full w-full fixed top-0 left-0" class:side-nav-open={sideNavIsOpen}>
      <ul class="mt-10 pt-2 bg-gray-100 shadow h-full text-gray-900">
        <li class="p-2 cursor-pointer">
          <Link to="/">
            <i class="fas fa-home" />
            <span class="pl-1 underline">Home</span>
          </Link>
        </li>
        <li class="p-2 cursor-pointer">
          <Link to="/game/new">
            <i class="fas fa-paper-plane" />
            <span class="pl-1 underline">Start a new Game</span>
          </Link>
        </li>
        {#if $game && new Date().valueOf() - $game.start < 24 * 60 * 60 * 1000}
        <li class="p-2 cursor-pointer">
          <Link to="/game/current">
            <i class="fas fa-history" />
            <span class="pl-1 underline">Resume Game</span>
          </Link>
        </li>
        {/if}
        <li class="p-2 cursor-pointer">
          <Link to="/leaders">
            <i class="fas fa-list-ol" />
            <span class="pl-1 underline">View Leaderboard</span>
          </Link>
        </li>
      </ul>
    </div>
  </Router>
</main>
