const mongoose = require('mongoose')
const Group = require('../../models/ticket/Group')

const GroupService = {
  getAll() {
    return new Promise((resolve, reject) => {
      Group.find({}, (err, groups) => {
        if (err) return reject(err)
        if (groups === null) return reject(new Error('No group found'))
        return resolve(groups)
      })
    })
  },
  getOne(groupId) {
    return new Promise((resolve, reject) => {
      Group.findOne({
        _id: groupId
      })
        .populate(['analysts'])
        .exec((err, group) => {
          if (err) return reject(err)
          if (group === null) return reject(new Error('No group found'))
          return resolve(group)
        })
    })
  },
  create(group) {
    return new Promise((resolve, reject) => {
      const newGroup = {
        _id: new mongoose.Types.ObjectId(),
        ...group
      }

      Group.create(newGroup, err => {
        if (err) return reject(err)
        return resolve()
      })
    })
  },
  edit(grouId, group) {
    return new Promise((resolve, reject) => {
      Group.updateOne(
        {
          _id: grouId
        },
        {
          $set: {
            name: group.name,
            analysts: group.analysts
          }
        }
      ).exec(err => {
        if (err) return reject(err)
        return resolve()
      })
    })
  },
  insertAnalyst(groupId, analystId) {
    return new Promise((resolve, reject) => {
      Group.updateOne(
        { _id: groupId },
        {
          $addToSet: {
            analysts: [analystId]
          }
        },
        err => {
          if (err) return reject(err)
          return resolve()
        }
      )
    })
  },
  removeAnalyst(groupId, analystId) {
    return new Promise((resolve, reject) => {
      Group.updateOne(
        { _id: groupId },
        {
          $pull: {
            analysts: {
              $in: [analystId]
            }
          }
        },
        err => {
          if (err) return reject(err)
          return resolve()
        }
      )
    })
  }
}

module.exports = GroupService
