import { dbContext } from '../db/DbContext'
import { BadRequest } from '../utils/Errors'

class BugsService {
  async getAllBugs(query = {}) {
    const bugs = await dbContext.Bug.find(query).populate('creator')
    return bugs
  }

  /**
   *Takes in a string and returns the bug if found
   * @param {String} id
   * @returns {Object}
   */
  async getBugById(id) {
    const data = await dbContext.Bug.findOne({ _id: id }).populate('creator', 'name picture email')
    if (!data) throw new BadRequest('Invalid Id')
    return data
  }

  async createBug(body) {
    return await dbContext.Bug.create(body)
  }

  async editBug(body) {
    const bug = await this.getBugById(body.id)
    if (bug.closed) throw new BadRequest('Can not edit')
    const data = await dbContext.Bug.findOneAndUpdate({ _id: body.id, creatorId: body.creatorId }, body, { new: true })
    if (!data) throw new BadRequest('Unable to Edit')
    return data
  }

  async closeBug(id) {
    const data = await dbContext.Bug.findOneAndUpdate({ _id: id, closed: false }, { closed: true }, { new: true })
    if (!data) throw new BadRequest('Invalid Id')
    return data
  }
}

export const bugsService = new BugsService()
