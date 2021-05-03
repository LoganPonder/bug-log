import { api } from './AxiosService'
import { AppState } from '../AppState'

class BugsService {
  async getAllBugs() {
    const res = await api.get('api/bugs')
    AppState.bugs = res.data
  }

  async createBug(newBug) {
    await api.post('api/bugs', newBug)
    this.getAllBugs()
  }

  async getBugById(id) {
    const res = await api.get(`api/bugs/${id}`)
    AppState.activeBug = res.data
  }

  async closeBug(bug) {
    await api.put(`api/bugs/${bug.id}`, bug, { new: true })
    this.getAllBugs()
  }
}

export const bugsService = new BugsService()
