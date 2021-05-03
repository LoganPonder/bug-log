import { dbContext } from '../db/DbContext'
import { BadRequest } from '../utils/Errors'

class NotesService {
  async createNote(newNote) {
    return await dbContext.Note.create(newNote)
  }

  async deleteNote(id, userId) {
    const data = await dbContext.Note.findOneAndDelete({ _id: id, creatorId: userId })
    if (!data) throw new BadRequest('Invalid Id')
    return 'Successfully Deleted'
  }

  async getNotesByBugId(query = {}) {
    return await dbContext.Note.find(query).populate('creator')
  }
}

export const notesService = new NotesService()
