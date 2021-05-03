<template>
  <header>
    <Navbar />
  </header>
  <main>
    <router-view />
  </main>
  <footer>
    <div class="text-light text-center p-4">
      Bug Log &copy; 2021
    </div>
  </footer>
</template>

<script>
import { computed } from 'vue'
import { AppState } from './AppState'
export default {
  name: 'App',
  setup() {
    return {
      appState: computed(() => AppState)
    }
  }
}
</script>
<style lang="scss">
@import "./assets/scss/main.scss";

footer {
background: #232526;  /* fallback for old browsers */
background: linear-gradient(to top, #27292a, #454d55); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
background: -webkit-linear-gradient(to top, #373a3b, #454d55);  /* Chrome 10-25, Safari 5.1-6 */
}
</style>
