const mongoose = require('mongoose')
const Ticket = require('../../models/ticket/Ticket')
const Comment = require('../../models/ticket/Comment')
const Group = require('../../models/ticket/Group')
const Notification = require('../../models/Notification')
const Status = require('../../models/ticket/Status')
const S3 = require('../../../plugins/S3')

const populateArray = [
  {
    path: 'openedBy'
  },
  {
    path: 'actualUser'
  },
  {
    path: 'affectedUser'
  },
  {
    path: 'logs',
    select: {
      date: 1,
      oldStatus: 1,
      group: 1,
      user: 1
    }
  },
  {
    path: 'comments',
    select: {
      date: 1,
      content: 1,
      user: 1
    }
  },
  'status',
  'group',
  'priority',
  'category'
]

const TicketService = {
  getTickets(filter, sortBy, page, limit) {
    // TODO sorting not works with doc ref
    return new Promise((resolve, reject) => {
      Ticket.paginate(
        filter,
        {
          page: page,
          limit: limit,
          sort: sortBy,
          populate: 'logs comments status'
        },
        (err, result) => {
          if (err) return reject(err)
          return resolve(result)
        }
      )
    })
  },
  getOne(ticketId) {
    return new Promise((resolve, reject) => {
      Ticket.findOne({
        _id: ticketId
      })
        .populate(populateArray)
        .exec((err, ticket) => {
          if (err) return reject(err)
          return resolve(ticket)
        })
    })
  },
  copyTicket(ticketId, userId) {
    return new Promise((resolve, reject) => {
      Ticket.findOne({
        _id: ticketId
      }).exec((err, ticket) => {
        if (err) reject(err)
        const newTicket = {
          openedBy: userId,
          actualUser: userId,
          affectedUser: ticket.affectedUser,
          resume: ticket.resume,
          content: ticket.content,
          status: ticket.status,
          group: ticket.group,
          category: ticket.category,
          priority: ticket.priority
        }
        resolve(this.create(newTicket))
      })
    })
  },
  updateOne(ticketId, ticketBody) {
    return new Promise((resolve, reject) => {
      Ticket.updateOne(
        {
          _id: ticketId
        },
        {
          $set: {
            status: ticketBody.status._id,
            group: ticketBody.group._id,
            resume: ticketBody.resume,
            content: ticketBody.content,
            category: ticketBody.category._id,
            actualUser: ticketBody.actualUser._id,
            affectedUser: ticketBody.affectedUser._id
          }
        }
      ).exec(async err => {
        if (err) return reject(err)
        const result = await Ticket.findOne({
          _id: ticketId
        })
          .populate(populateArray)
          .exec()
        return resolve(result)
      })
    })
  },
  create(ticketBody) {
    return new Promise((resolve, reject) => {
      const ticket = {
        _id: new mongoose.Types.ObjectId(),
        ...ticketBody
      }

      Ticket.create(ticket, async (err, result) => {
        if (err) return reject(err)
        const newTicket = await Ticket.findOne({ _id: result._id })
          .populate(populateArray)
          .exec()

        const notification = await Notification.create({
          _id: new mongoose.Types.ObjectId(),
          name: 'TicketCreate',
          from: newTicket.openedBy._id,
          to: newTicket.group.analysts.map(a => a._id),
          content: `${newTicket.openedBy.name} abriu um novo chamado`
        })

        return resolve(newTicket)
      })
    })
  },
  changeStatus(ticketId, statusId) {
    return new Promise((resolve, reject) => {
      Ticket.findOne({ _id: ticketId })
        .populate(populateArray)
        .exec()
        .then(async ticket => {
          const status = await Status.findOne({
            _id: statusId
          })

          ticket.status = status._id

          const newTicket = {
            ...ticket._doc,
            status: status
          }

          ticket.save(err => {
            if (err) return reject(err)
            return resolve(newTicket)
          })
        })
    })
  },
  transferToGroup(ticketId, groupId) {
    return new Promise(async (resolve, reject) => {
      const ticket = await Ticket.findOne({ _id: ticketId })
        .populate(populateArray)
        .exec()

      const group = await Group.findOne({ _id: groupId }).populate(['analysts'])

      ticket.group = group._id

      const newTicket = {
        ...ticket._doc,
        group: group
      }

      ticket.save(err => {
        if (err) return reject(err)
        return resolve(newTicket)
      })
    })
  },
  commentOnTicket(ticketId, userId, content) {
    return new Promise((resolve, reject) => {
      Comment.create(
        {
          _id: new mongoose.Types.ObjectId(),
          user: userId,
          content: content
        },
        (err, comment) => {
          if (err) reject(err)
          Ticket.updateOne(
            {
              _id: ticketId
            },
            {
              $addToSet: {
                comments: [comment]
              }
            }
          ).exec(err => {
            if (err) return reject(err)
            Comment.findOne({
              _id: comment._id
            })
              .populate(['user'])
              .exec((err, toReturn) => {
                if (err) return reject(err)
                return resolve(toReturn)
              })
          })
        }
      )
    })
  },
  insertFile(ticketId, files) {
    return new Promise(async (resolve, reject) => {
      const ticket = await Ticket.findOne({
        _id: ticketId
      }).exec()
      for (let i = 0; i < files.length; i++) {
        const f = files[i]

        const name = `${ticketId} - ${f.name} - ${i}`
        const params = {
          Bucket: process.env.BUCKET,
          Key: name,
          Body: f.data
        }
        await S3.upload(params).promise()

        ticket.files.push({
          name: name,
          type: f.mimetype
        })
        await ticket.save()
      }
      return resolve(ticket.files)
    })
  },
  getFile(fileId) {
    return new Promise((resolve, reject) => {
      S3.getObject(
        {
          Bucket: process.env.BUCKET,
          Key: fileId
        },
        (err, file) => {
          if (err) return reject(err)
          return resolve(file.Body)
        }
      )
    })
  },
  removeFile(ticketId, fileId) {
    return new Promise(async (resolve, reject) => {
      const ticket = await Ticket.findOne({
        _id: ticketId
      })
      S3.deleteObject(
        {
          Bucket: process.env.BUCKET,
          Key: fileId
        },
        err => {
          if (err) return reject(err)
          ticket.files = ticket.files.filter(f => {
            return f.name !== fileId
          })
          ticket.save()
          return resolve(ticket)
        }
      )
    })
  }
}

module.exports = TicketService
