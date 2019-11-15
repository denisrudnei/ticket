const mongoose = require('mongoose')
const Priority = require('../models/ticket/Priority')

const PriorityService = {
  create(priority) {
    return new Promise((resolve, reject) => {
      Priority.create(
        {
          _id: new mongoose.Types.ObjectId(),
          name: priority.name,
          weight: priority.weight
        },
        err => {
          if (err) reject(err)
          resolve()
        }
      )
    })
  },
  getAll() {
    return new Promise((resolve, reject) => {
      Priority.find().exec((err, result) => {
        if (err) reject(err)
        resolve(result)
      })
    })
  },
  edit(priority) {
    return new Promise((resolve, reject) => {
      Priority.updateOne(
        {
          _id: priority._id
        },
        {
          $set: {
            name: priority.name,
            weight: priority.weight
          }
        },
        err => {
          if (err) reject(err)
          resolve()
        }
      )
    })
  },
  editMany(priorities) {
    const all = priorities.map(priority => this.edit(priority))
    return Promise.all(all)
  },
  remove(priorityId) {
    return new Promise((resolve, reject) => {
      Priority.deleteOne(
        {
          _id: priorityId
        },
        err => {
          if (err) reject(err)
          resolve()
        }
      )
    })
  }
}

module.exports = PriorityService
