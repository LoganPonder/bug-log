import { Auth0Provider } from '@bcwdev/auth0provider'
import BaseController from '../utils/BaseController'
import { bugsService } from '../services/BugsService'
import { notesService } from '../services/NotesService'

export class BugsController extends BaseController {
  constructor() {
    super('api/bugs')
    this.router
      .get('', this.getAllBugs)
      .get('/:id', this.getBugById)
      .get('/:id/notes', this.getNotesByBugId)
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createBug)
      .put('/:id', this.editBug)
      .delete('/:id', this.closeBug)
  }

  async getAllBugs(req, res, next) {
    try {
      const bugs = await bugsService.getAllBugs(req.query)
      return res.send(bugs)
    } catch (error) {
      next(error)
    }
  }

  async getBugById(req, res, next) {
    try {
      const bug = await bugsService.getBugById({ _id: req.params.id })
      return res.send(bug)
    } catch (error) {
      next(error)
    }
  }

  async createBug(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      const newBug = await bugsService.createBug(req.body)
      return res.send(newBug)
    } catch (error) {
      next(error)
    }
  }

  async editBug(req, res, next) {
    try {
      delete req.body.closed
      req.body.id = req.params.id
      req.body.creatorId = req.userInfo.id
      const data = await bugsService.editBug(req.body)
      return res.send(data)
    } catch (error) {
      next(error)
    }
  }

  async closeBug(req, res, next) {
    try {
      const data = await bugsService.closeBug(req.params.id)
      return res.send(data)
    } catch (error) {
      next(error)
    }
  }

  async getNotesByBugId(req, res, next) {
    try {
      const notes = await notesService.getNotesByBugId({ bug: req.params.id })
      return res.send(notes)
    } catch (error) {
      next(error)
    }
  }
}
