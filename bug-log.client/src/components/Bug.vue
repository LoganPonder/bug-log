<template>
  <tr>
    <router-link class="link-no-style" :to="{ name: 'BugDetailsPage', params:{id:bug.id}}">
      <th scope="row">
        {{ bug.title }}
      </th>
    </router-link>
    <td> <img :src="state.user.picture" alt=""> {{ state.user.nickname }}</td>
    <td class="closed" v-if="bug.closed">
      CLOSED
    </td>
    <td class="open" v-else>
      OPEN
    </td>
    <td>{{ new Date( bug.updatedAt ).toLocaleDateString() }}</td>
  </tr>
</template>

<script>
import { computed, reactive } from 'vue'
import { AppState } from '../AppState'

export default ({
  name: 'Bug',
  props: {
    bug: {
      type: Object,
      required: true
    }
  },
  setup() {
    const state = reactive({
      account: computed(() => AppState.account),
      user: computed(() => AppState.user),
      bugs: computed(() => AppState.bugs)
    })
    return {
      state
    }
  },
  components: {}
})
</script>

<style lang="scss" scoped>
@import '../assets/scss/_variables.scss';

.closed {
  color: rgb(255, 0, 0);
}

.open {
  color: $primary;
}

.link-no-style{
  text-decoration: none;
  cursor: pointer;
  color: #fff;
}

img {
  height:2rem;
  border-radius: 50%
}
</style>
