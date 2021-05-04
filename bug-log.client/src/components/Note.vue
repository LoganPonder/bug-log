<template>
  <tr>
    <th scope="row">
      <img :src="note.creator.picture" alt="">{{ note.creator.name }}
    </th>
    <td>
      {{ note.body }}
    </td>
    <td><i class="far fa-trash-alt" data-toggle="modal" data-target="#exampleModal"></i></td>
  </tr>
  <div class="modal"
       id="exampleModal"
       tabindex="-1"
       role="dialog"
       aria-labelledby="exampleModalLabel"
       aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content text-center">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            Are you sure you want to delete this note?
          </h5>
          <button type="button" class="close modal-close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-footer d-flex justify-content-center">
          <button type="button" class="modal-close-btn" data-dismiss="modal">
            Cancel
          </button>
          <button type="button" class="modal-send-btn" @click="deleteNote(note.id, note.bug)">
            Yes, Delete Note
          </button>
        </div>
      </div>
    </div>
  </div>
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

  .modal-content {
    background-color: rgba($dark-bg, .95);
    color: #fff;
  }

  .modal-title {
    font-weight: 100;
    font-size: 2rem;
  }

.modal-close {
  color: #fff;
}
  .modal-send-btn {
    color: $primary;
    background-color: transparent;
    cursor: pointer;
    border: $primary 0.125em solid;
    padding: .25em 1em;
    border-radius: .3em;
    text-shadow:0 0 0.025em hsl(0, 0%, 100% / 0.5), 0 0 0.45em currentColor;
    box-shadow: inset 0 0 1em $primary, 0 0 1em $primary;
    position: relative;
  }

  .modal-close-btn {
    color: $danger;
    background-color: transparent;
    cursor: pointer;
    border: $danger 0.125em solid;
    padding: .25em 1em;
    border-radius: .3em;
    text-shadow:0 0 0.025em hsl(0, 0%, 100% / 0.5), 0 0 0.45em currentColor;
    box-shadow: inset 0 0 1em $danger, 0 0 1em $danger;
    position: relative;
  }

.modal-close-btn:hover {
    box-shadow: inset 0 0 2em .5em $danger, 0 0 3em .5em $danger;
    text-shadow: none;
    color: #fff;
  }

  .modal-send-btn:hover {
    box-shadow: inset 0 0 2em .5em $primary, 0 0 3em .5em $primary;
    text-shadow: none;
    color: #fff;
  }
</style>
