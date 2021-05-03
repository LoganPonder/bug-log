<template>
  <tr>
    <th scope="row">
      <img :src="note.creator.picture" alt="">{{ note.creator.name }}
    </th>
    <td>
      {{ note.body }}
    </td>
    <td><i class="far fa-trash-alt" @click="deleteNote(note.id, note.bug)"></i></td>
  </tr>
</template>

<script>
import { computed, reactive } from '@vue/runtime-core'
import { AppState } from '../AppState'
import { notesService } from '../services/NotesService'
import Notification from '../utils/Notification'

export default ({
  name: 'Note',
  props: {
    note: {
      type: Object,
      required: true
    }
  },
  setup() {
    const state = reactive({
      account: computed(() => AppState.account),
      user: computed(() => AppState.user),
      bugs: computed(() => AppState.bugs),
      notes: computed(() => AppState.notes)
    })
    return {
      state,
      async deleteNote(id, bug) {
        try {
          await notesService.deleteNote(id, bug)
          Notification.toast('Succesfully Deleted', 'success')
        } catch (error) {
          Notification.toast('Error: ', error + 'error')
        }
      }
    }
  },
  components: {}
})
</script>

<style lang="scss" scoped>
@import '../assets/scss/_variables.scss';

td, th {
  max-width: 5rem;
  min-width: 2rem;
  word-break:break-all;
}

i {
  cursor: pointer;
  color: $danger;
  font-size: 1.5rem;
}

img {
  height: 2rem;
  border-radius: 50%;
  margin-right: .5rem;
}

</style>
