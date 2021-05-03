<template>
  <!-- <div v-if="state.loading == true">
    loading...
  </div> -->
  <div class="home flex-grow-1 d-flex flex-column container-fluid">
    <div class="row justify-content-around">
      <div class="col-10 mt-5">
        <div class="heading-content d-flex justify-content-between">
          <div class="title-content d-flex align-items-center mb-4">
            <h1 class="mr-4">
              Current Bugs:
            </h1>
            <button data-toggle="modal" data-target="#exampleModal" class="report-btn">
              Report
            </button>
          </div>
          <div class="custom-control custom-switch d-flex align-items-center">
            <input type="checkbox" class="custom-control-input" id="customSwitch1">
            <label class="custom-control-label" for="customSwitch1">Hide Closed</label>
          </div>
        </div>
        <table class="table table-dark">
          <thead>
            <tr>
              <th scope="col">
                Title
              </th>
              <th scope="col">
                Reported By
              </th>
              <th scope="col">
                Status
              </th>
              <th scope="col">
                Last Modified
              </th>
            </tr>
          </thead>
          <tbody>
            <Bug v-for="bug in state.bugs" :key="bug.id" :bug="bug" />
          </tbody>
        </table>
      </div>
      <!-- start modal -->
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
              <h4 class="modal-title" id="exampleModalLabel">
                New Bug Report
              </h4>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true" class="text-white">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="createBug">
                <div class="form-group text-left">
                  <small>Reported by:</small>
                  <h5>Logan Ponder</h5>
                </div>
                <div class="form-group text-left">
                  <label for="recipient-name" class="col-form-label">Title:</label>
                  <input v-model="state.newBug.title" type="text" class="form-control" id="recipient-name">
                </div>
                <div class="form-group text-left">
                  <label for="message-text" class="col-form-label">Description:</label>
                  <textarea v-model="state.newBug.description" class="form-control" id="message-text"></textarea>
                </div>
                <button type="button" class="btn modal-close-btn mr-3" data-dismiss="modal">
                  Close
                </button>
                <button type="submit" class="btn modal-send-btn">
                  Create Report
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- modal end -->
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive } from 'vue'
import { AppState } from '../AppState'
import Notification from '../utils/Notification'
import { bugsService } from '../services/BugsService'
import $ from 'jquery'

export default {
  name: 'Home',
  setup() {
    const state = reactive({
      newBug: {},
      account: computed(() => AppState.account),
      user: computed(() => AppState.user),
      bugs: computed(() => AppState.bugs),
      loading: true
    })

    onMounted(async() => {
      try {
        state.loading = false
      } catch (error) {
        Notification.toast('Error: ' + error, 'error')
      }
    })
    return {
      state,
      async createBug() {
        try {
          await bugsService.createBug(state.newBug)
          state.newBug = {}
          $('#exampleModal').modal('toggle')
          Notification.toast('Successfully Created', 'success')
        } catch (error) {
          Notification.toast('Error: ' + error, 'error')
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '../assets/scss/_variables.scss';

.home{
  background-color: $dark-bg;
  color: #fff;
  text-align: center;
  user-select: none;
  // font-family: 'Roboto', sans-serif;
  > img{
    height: 200px;
    width: 200px;
  }

  h1 {
    font-size: 5rem;
    font-weight: 100;
  }

  .report-btn,
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

  .report-btn::before {
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

  .report-btn:hover::after {
    opacity: 1;
  }

  .report-btn:hover,
  .modal-send-btn:hover {
    box-shadow: inset 0 0 2em .5em $primary, 0 0 3em .5em $primary;
    text-shadow: none;
    color: #fff;
  }

  .modal-close-btn:hover {
    box-shadow: inset 0 0 2em .5em $danger, 0 0 3em .5em $danger;
    text-shadow: none;
    color: #fff;
  }

  table {
    text-transform: uppercase;
  }
  .custom-switch {
    transform: scale(1.6) !important;
    margin-right: 4rem;
    font-weight: 300;
  }

  .custom-control-label {
    cursor: pointer;
  }

  .modal-content {
    background-color: rgba($dark-bg, .95);
    color: #fff;
  }

  .modal-title {
    font-weight: 100;
    font-size: 2rem;
  }

  img {
    height: 2rem;
    border-radius: 50%;
  }
}
</style>
