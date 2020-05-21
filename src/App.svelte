<script>
  import {Router, Route} from "svelte-routing"
  import Landing from 'routes/Landing'
  import NewGame from 'routes/NewGame'
  import CurrentGame from 'routes/CurrentGame'
  import Scores from 'routes/Scores'
  import Leaders from 'routes/Leaders'
  import Next from 'routes/Next'
  import Hole from 'routes/Hole'

  export let url = "";
	export let name = 'Duthie Course';
</script>

<main class="bg-gray-700 inset-0 absolute text-white overflow-auto">
  <div class="h-10 bg-red-500 p-2 fixed w-full shadow">
    <div class="container m-auto sm:px-3">
      <i class="fas fa-bars absolute pt-1" />
      <h1 class="text-center">{name}</h1>
    </div>
  </div>
  <div class="container m-auto mt-10 p-3">
    <Router {url}>
      <Route path="new" component={NewGame} />
      <Route path="game" component={CurrentGame} />
      <Route path="scores" component={Scores} />
      <Route path="next" component={Next} />
      <Route path="leaders" component={Leaders} />
      <Route path="hole/:id" component={Hole} />
      <Route path="*"><Landing /></Route>
    </Router>
  </div>
</main>
