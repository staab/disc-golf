<script>
  import {blur} from 'svelte/transition'
</script>

<div in:blur class="shadow rounded border border-gray-500 border-solid p-3 mb-4 bg-white text-gray-900">
  <slot />
</div>
