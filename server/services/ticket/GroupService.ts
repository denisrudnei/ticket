import Group from '../../models/ticket/Group'
import Analyst from '../../models/Analyst'

class GroupService {
  getAll(): Promise<Group[]> {
    return new Promise((resolve, reject) => {
      Group.find({ relations: ['analysts'] }).then(groups => {
        return resolve(groups)
      })
    })
  }

  getOne(groupId: Group['id']): Promise<Group> {
    return new Promise((resolve, reject) => {
      Group.findOne(groupId).then(group => {
        if (!group) return reject(new Error('No group found'))
        return resolve(group)
      })
    })
  }

  create(group: Group): Promise<Group> {
    return new Promise((resolve, reject) => {
      resolve(Group.create(group).save())
    })
  }

  edit(groupId: Group['id'], groupToEdit: Group): Promise<void> {
    return new Promise((resolve, reject) => {
      Group.findOne(groupId, { relations: ['analysts'] }).then(group => {
        if (!group) reject(new Error('Group not found'))
        group!.name = groupToEdit.name
        group!.analysts = groupToEdit.analysts
        group!.save()
        resolve()
      })
    })
  }

  insertAnalyst(
    groupId: Group['id'],
    analystId: Analyst['id']
  ): Promise<Group> {
    return new Promise((resolve, reject) => {
      Group.findOne(groupId, { relations: ['analysts'] }).then(async group => {
        const analyst = await Analyst.findOne(analystId)
        group!.analysts.push(analyst!)
        group!.save().then(group => {
          resolve(group)
        })
      })
    })
  }

  removeAnalyst(
    groupId: Group['id'],
    analystId: Analyst['id']
  ): Promise<Group> {
    return new Promise((resolve, reject) => {
      Group.findOne(groupId, { relations: ['analysts'] }).then(async group => {
        const analyst = await Analyst.findOne(analystId)
        group!.analysts.push(analyst!)
        group!.save().then(group => {
          resolve(group)
        })
      })
    })
  }
}

export default new GroupService()
