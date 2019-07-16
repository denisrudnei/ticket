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
  'category'
]

const TicketService = {
  getTickets(sortBy, page, limit) {
    // TODO sorting not works with doc ref
    return new Promise((resolve, reject) => {
      Ticket.paginate(
        {},
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
            actualUser: ticketBody.actualUser._id
          }
        }
      ).exec(err => {
        if (err) return reject(err)
        return resolve(ticketBody)
      })
    })
  },
  create(ticketBody) {
    return new Promise(async (resolve, reject) => {
      const ticket = {
        _id: new mongoose.Types.ObjectId(),
        ...ticketBody
      }

      const notification = await Notification.create({
        _id: new mongoose.Types.ObjectId(),
        name: 'TicketCreate',
        from: ticket.openedBy._id,
        to: ticket.group.analysts.map(a => a._id),
        content: `${ticket.openedBy.name} abriu um novo chamado`
      })

      Ticket.create(ticket, async (err, result) => {
        if (err) return resolve(result)
        const newTicket = await Ticket.findOne({ _id: result._id }).populate(
          populateArray
        )
        return resolve(result, {
          result: newTicket,
          notification: notification
        })
      })
    })
  },
  changeStatus(ticketId, statusId) {
    return new Promise(async (resolve, reject) => {
      const ticket = await Ticket.findOne({ _id: ticketId })
        .populate(populateArray)
        .exec()

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
  },
  transferToGroup(ticketId, groupId) {
    return new Promise(async (resolve, reject) => {
      const ticket = await Ticket.findOne({ _id: ticketId })
        .populate(populateArray)
        .exec()

      const group = await Group.findOne({ _id: groupId })

      ticket.group = group._id

      const newTicket = {
        ...ticket._doc,
        group: group
      }

      const notification = await Notification.create({
        _id: new mongoose.Types.ObjectId(),
        name: 'TicketTransfer',
        from: ticket.openedBy._id,
        to: group.analysts.map(a => a._id),
        content: `${ticket.openedBy.name} transferiu um chamado para seu grupo`
      })

      ticket.save(err => {
        if (err) return reject(err)
        return resolve({
          newTicket: newTicket,
          notification: notification
        })
      })
    })
  },
  commentOnTicket(ticketId, userId, content) {
    return new Promise((resolve, reject) => {
      Ticket.findOne({
        _id: ticketId
      })
        .populate(populateArray)
        .exec(async (err, ticket) => {
          if (err) return resolve(ticket)

          const comment = await Comment.create({
            _id: new mongoose.Types.ObjectId(),
            user: userId,
            content: content
          })
          ticket.comments.push(comment)
          ticket.save(async err => {
            if (err)
              return reject(
                new Error({
                  message: 'Error'
                })
              )
            const newTicket = await Ticket.findOne({
              _id: ticketId
            }).populate(populateArray)

            return resolve(newTicket)
          })
        })
    })
  },
  insertFile(ticketId, files) {
    return new Promise(async (resolve, reject) => {
      const ticket = await Ticket.findOne({
        _id: ticketId
      })
      files.forEach(async (f, index) => {
        await S3.createBucket(async () => {
          const name = `${ticketId} - ${f.name} - ${index}`
          const params = {
            Bucket: process.env.BUCKET,
            Key: name,
            Body: f.data
          }
          await S3.upload(params, (err, _) => {
            if (err) return reject(err)
            ticket.files.push({
              name: name,
              type: f.mimetype
            })
            ticket.save()
          })
        })
      })
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
