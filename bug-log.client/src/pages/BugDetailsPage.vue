<template>
  <div v-if="state.loading">
    Loading..
  </div>
  <div v-else class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-10 mt-5">
        <p class="mb-0 lead">
          Title
        </p>
        <div class="heading-content d-flex justify-content-between mb-4">
          <h2>
            {{ state.activeBug.title }}
          </h2>
          <div v-if="state.activeBug.closed"></div>
          <button v-else class="close-btn align-self-center" data-toggle="modal" data-target="#closeBugModal">
            CLOSE
          </button>
        </div>
        <div class="subheading-content d-flex justify-content-between">
          <div class="author d-flex align-items-center">
            <small class="mr-2">Reported by:</small>
            <h3 class="author-name">
              {{ state.activeBug.creator.name }}
            </h3>
          </div>
          <div class="status d-flex align-items-center">
            <small class="mr-2">STATUS: </small>
            <h4 class="red-text" v-if="state.activeBug.closed">
              CLOSED || {{ new Date( state.activeBug.updatedAt ).toLocaleDateString() }}
            </h4>
            <h4 class="blue-text" v-else>
              OPEN
            </h4>
          </div>
        </div>
        <div class="description-container mb-4 rounded shadow">
          <p class="lead p-4">
            {{ state.activeBug.description }}
          </p>
        </div>
        <div class="note-content my-4">
          <div class="note-heading d-flex justify-content-start align-items-center mb-4">
            <h2 class="mr-4">
              Notes
            </h2>
            <div v-if="state.activeBug.closed"></div>
            <button v-else class="note-btn" data-toggle="modal" data-target="#exampleModal">
              Add Note
            </button>
          </div>
          <table class="table table-dark rounded shadow">
            <thead>
              <tr>
                <th scope="col">
                  Name
                </th>
                <th scope="col">
                  Message
                </th>
                <th scope="col">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              <Note v-for="note in state.notes" :key="note.id" :note="note" />
            </tbody>
          </table>
        </div>
      </div>
      <!-- start modal add note -->
      <div class="modal"
           id="exampleModal"
           tabindex="-1"
           role="dialog"
           aria-labelledby="exampleModalLabel"
           aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                New Note
              </h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true" class="text-white">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form @submit="createNote">
                <div class="form-group text-left">
                  <small>Reported By:</small>
                  <h4 class="modal-author">
                    {{ state.user.name }}
                  </h4>
                </div>
                <div class="form-group text-left">
                  <label for="new-note-body" class="col-form-label">Description:</label>
                  <textarea required v-model="state.newNote.body" class="form-control" id="new-note-body"></textarea>
                </div>
                <button type="submit" class="btn modal-send-btn">
                  Create Note
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- modal end note -->
      <!-- START/bug close modal -->
      <div class="modal"
           id="closeBugModal"
           tabindex="-1"
           role="dialog"
           aria-labelledby="closeBugModalLabel"
           aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span class="text-white" aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body text-center">
              <h5 class="modal-title mb-2" id="closeBugModalLabel">
                Are you sure you want to close this Bug Report?
              </h5>
              <p class="pb-0 mb-0 lead">
                This action can't be reversed
              </p>
            </div>
            <div class="modal-footer d-flex justify-content-center">
              <button @click="closeBug(state.activeBug)" class="btn modal-send-btn mr-4">
                Yes, close this report
              </button>
              <button type="button" class="btn modal-close-btn" data-dismiss="modal">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- close bug end modal -->
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, computed } from 'vue'
import { AppState } from '../AppState'
import Notification from '../utils/Notification'
import { bugsService } from '../services/BugsService'
import { useRoute } from 'vue-router'
import { notesService } from '../services/NotesService'
import $ from 'jquery'

export default {
  name: 'BugDetailsPage',
  props: {
    bug: {
      type: Object,
      required: true
    }
  },
  setup() {
    const route = useRoute()
    const state = reactive({
      newNote: {},
      loading: true,
      user: computed(() => AppState.user),
      activeBug: computed(() => AppState.activeBug),
      notes: computed(() => AppState.notes)
    })
    onMounted(async() => {
      try {
        await bugsService.getBugById(route.params.id)
        await notesService.getAllNotesByBugId(route.params.id)
        state.loading = false
      } catch (error) {
        Notification.toast('Error: ' + error, 'error')
      }
    })
    return {
      state,
      async createNote() {
        try {
          state.newNote.bug = state.activeBug.id
          await notesService.createNote(state.newNote)
          $('#exampleModal').modal('toggle')
          state.newNote = {}
        } catch (error) {
          Notification.toast('Error: ' + error, 'error')
        }
      },
      async closeBug(bug) {
        try {
          state.activeBug.closed = true
          await bugsService.closeBug(bug)
        } catch (error) {
          Notification.toast('Error: ' + error, 'error')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/_variables.scss';

.container-fluid {
  background-color: $dark-bg;
  color: #fff;
  line-height: 1.6;
}

.page-container {
  background-color: rgba(27, 32, 41, 0.596);
}

.description-container {
  background-color: #343a40;
}

table {
  border-bottom-right-radius: 5px !important;
  border-bottom-left-radius: 5px !important;
}

h2 {
  font-size: 4rem;
  font-weight: 100;
}

  .close-btn,
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

  .close-btn::before {
    pointer-events: none;
    content: '';
    position: absolute;
    background: $danger;
    top: 120%;
    left: 0;
    width: 100%;
    height: 100%;
    // perspective must be declared before rotate
    transform: perspective(1em) rotateX(60deg) scale(1, 0.35);
    filter: blur(1em);
    opacity: 0.7;
  }

  .close-btn:hover::after {
    opacity: 1;
  }

  .close-btn:hover,
  .modal-close-btn:hover {
    box-shadow: inset 0 0 2em .5em $danger, 0 0 3em .5em $danger;
    text-shadow: none;
    color: #fff;
  }

  .red-text {
    color: $danger;
  }

  .blue-text {
    color: $primary;
  }

  .note-btn,
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

  // tbody {
  //   max-width: 100%;
  // }
  .note-btn::before {
    pointer-events: none;
    content: '';
    position: absolute;
    background: $primary;
    top: 120%;
    left: 0;
    width: 100%;
    height: 100%;
    // perspective must be declared before rotate
    transform: perspective(1em) rotateX(60deg) scale(1, 0.35);
    filter: blur(1em);
    opacity: 0.7;
  }

  .note-btn:hover::after {
    opacity: 1;
  }

  .note-btn:hover,
  .modal-send-btn:hover {
    box-shadow: inset 0 0 2em .5em $primary, 0 0 3em .5em $primary;
    text-shadow: none;
    color: #fff;
  }

   .modal-content {
    background-color: rgba($dark-bg, .95);
    color: #fff;
  }

  .modal-title {
    font-weight: 100;
    font-size: 2rem;
  }

  .modal-author {
    font-weight: 300;
  }

</style>
