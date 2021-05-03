import { api } from './AxiosService'
import { AppState } from '../AppState'

class NotesService {
  async getAllNotesByBugId(id) {
    const res = await api.get(`api/bugs/${id}/notes`)
    AppState.notes = res.data
  }

  async createNote(newNote) {
    await api.post('api/notes', newNote)
    this.getAllNotesByBugId(newNote.bug)
  }

  async deleteNote(id, bug) {
    await api.delete(`api/notes/${id}`)
    this.getAllNotesByBugId(bug)
  }
}

export const notesService = new NotesService()
