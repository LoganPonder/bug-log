import { api } from './AxiosService'
import { AppState } from '../AppState'
import router from '../router'

class BugsService {
  async getAllBugs() {
    const res = await api.get('api/bugs')
    AppState.bugs = res.data
  }

  async createBug(newBug) {
    const bug = await api.post('api/bugs', newBug)
    console.log(bug.data)
    router.push({ name: 'BugDetailsPage', params: { id: bug.data.id } })
    this.getAllBugs()
  }

  async getBugById(id) {
    const res = await api.get(`api/bugs/${id}`)
    AppState.activeBug = res.data
  }

  async closeBug(bug) {
    await api.put(`api/bugs/${bug.id}`, bug, { new: true })
    // this.getAllBugs()
  }
}

export const bugsService = new BugsService()
