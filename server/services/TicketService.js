const mongoose = require('mongoose')
const Ticket = require('../models/Ticket')
const Comment = require('../models/Comment')
const Group = require('../models/Group')
const Notification = require('../models/Notification')
const Status = require('../models/Status')
const S3 = require('../../plugins/S3')

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
  getTickets(sortBy, page, limit, callback) {
    // TODO sorting not works with doc ref
    Ticket.paginate(
      {},
      {
        page: page,
        limit: limit,
        sort: sortBy,
        populate: 'logs comments status'
      },
      (err, result) => {
        return callback(err, result)
      }
    )
  },
  getOne(ticketId, callback) {
    Ticket.findOne({
      _id: ticketId
    })
      .populate(populateArray)
      .exec((err, ticket) => {
        return callback(err, ticket)
      })
  },
  updateOne(ticketId, ticketBody, callback) {
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
      return callback(err, ticketBody)
    })
  },
  async create(ticketBody, callback) {
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
      if (err) return callback(err, result)
      const newTicket = await Ticket.findOne({ _id: result._id }).populate(
        populateArray
      )
      return callback(err, {
        result: newTicket,
        notification: notification
      })
    })
  },
  async changeStatus(ticketId, statusId, callback) {
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
      return callback(err, newTicket)
    })
  },
  async transferToGroup(ticketId, groupId, callback) {
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
      return callback(err, {
        newTicket: newTicket,
        notification: notification
      })
    })
  },
  commentOnTicket(ticketId, userId, content, callback) {
    Ticket.findOne({
      _id: ticketId
    })
      .populate(populateArray)
      .exec(async (err, ticket) => {
        if (err) return callback(err, ticket)

        const comment = await Comment.create({
          _id: new mongoose.Types.ObjectId(),
          user: userId,
          content: content
        })
        ticket.comments.push(comment)
        ticket.save(async err => {
          if (err)
            return callback(err, {
              message: 'Error'
            })
          const newTicket = await Ticket.findOne({
            _id: ticketId
          }).populate(populateArray)

          return callback(err, newTicket)
        })
      })
  },
  async insertFile(ticketId, files, callback) {
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
        await S3.upload(params, (err, data) => {
          if (err) return callback(err, data)
          ticket.files.push({
            name: name,
            type: f.mimetype
          })
          ticket.save()
        })
      })
    })
    return callback(null, ticket.files)
  },
  getFile(fileId, callback) {
    S3.getObject(
      {
        Bucket: process.env.BUCKET,
        Key: fileId
      },
      (err, file) => {
        callback(err, file.Body)
      }
    )
  },
  async removeFile(ticketId, fileId, callback) {
    const ticket = await Ticket.findOne({
      _id: ticketId
    })
    S3.deleteObject(
      {
        Bucket: process.env.BUCKET,
        Key: fileId
      },
      err => {
        if (err) return callback(err, null)
        ticket.files = ticket.files.filter(f => {
          return f.name !== fileId
        })
        ticket.save()
        return callback(err, ticket)
      }
    )
  }
}

module.exports = TicketService
