<script>
  import {Router, Route, Link} from "svelte-routing"
  import {name} from 'util/course.js'
  import {game} from 'util/state.js'
  import {replaceSubdomain} from 'util/misc.js'
  import Index from 'routes/Index'
  import Landing from 'routes/Landing'
  import NewGame from 'routes/NewGame'
  import CurrentGame from 'routes/CurrentGame'
  import SubmitScores from 'routes/SubmitScores'
  import GameOver from 'routes/GameOver'
  import ViewGame from 'routes/ViewGame'
  import Leaders from 'routes/Leaders'
  import Hole from 'routes/Hole'
  import Card from 'partials/Card'
  import Map from 'partials/Map'

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
  class="bg-gray-200 inset-0 absolute overflow-y-scroll"
  on:click={closeSideNav}>
  <div class="h-10 bg-red-500 p-2 fixed w-full shadow top-nav text-white">
    <div class="container max-w-xl m-auto sm:px-3">
      {#if name}
      <i class="fas fa-bars absolute pt-1 cursor-pointer" on:click={openSideNav} />
      {/if}
      <h1 class="text-center">{name || "Disc Golf Scoreboard"}</h1>
    </div>
  </div>
  {#if name}
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
      <ul class="mt-10 pt-2 pl-2 bg-gray-100 shadow h-full text-gray-900">
        <li>
          <Link to="/">
            <div class="p-2 cursor-pointer">
              <i class="fas fa-home" />
              <span class="pl-1 underline">Home</span>
            </div>
          </Link>
        </li>
        <li>
          <Link to="/game/new">
            <div class="p-2 cursor-pointer">
              <i class="fas fa-paper-plane" />
              <span class="pl-1 underline">Start a new Game</span>
            </div>
          </Link>
        </li>
        {#if $game && new Date().valueOf() - $game.start < 24 * 60 * 60 * 1000}
        <li>
          <Link to="/game/current">
            <div class="p-2 cursor-pointer">
              <i class="fas fa-history" />
              <span class="pl-1 underline">Resume Game</span>
            </div>
          </Link>
        </li>
        {/if}
        <li>
          <Link to="/leaders">
            <div class="p-2 cursor-pointer">
              <i class="fas fa-list-ol" />
              <span class="pl-1 underline">View Leaderboard</span>
            </div>
          </Link>
        </li>
        <li>
          <a href="{replaceSubdomain('www')}">
            <div class="p-2 cursor-pointer">
              <i class="fas fa-map-marker-alt" />
              <span class="pl-1 underline">All Courses</span>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </Router>
  {:else}
  <div class="container max-w-xl m-auto mt-10 p-3">
    <Index />
  </div>
  {/if}
</main>
