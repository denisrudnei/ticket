import { Types, PaginateResult } from 'mongoose'
import AWS from 'aws-sdk'
import { UploadedFile } from 'express-fileupload'
import Ticket, { ITicket } from '~/server/models/ticket/Ticket'
import Comment, { IComment } from '~/server/models/ticket/Comment'
import Group, { IGroup } from '~/server/models/ticket/Group'
import Notification from '~/server/models/Notification'
import Status, { IStatus } from '~/server/models/ticket/Status'
import { IFile } from '~/server/models/File'
import S3 from '~/plugins/S3'
import { IAnalyst } from '~/server/models/Analyst'

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
  'category',
  'children'
]

class TicketService {
  getTickets(
    filter: any,
    sortBy: any,
    page: number,
    limit: number
  ): Promise<PaginateResult<ITicket>> {
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
        (err: Error, result: PaginateResult<ITicket>) => {
          if (err) return reject(err)
          return resolve(result)
        }
      )
    })
  }

  getOne(ticketId: ITicket['_id']): Promise<ITicket> {
    return new Promise((resolve, reject) => {
      Ticket.findOne({
        _id: ticketId
      })
        .populate(populateArray)
        .exec((err: Error, ticket: ITicket) => {
          if (err) return reject(err)
          return resolve(ticket)
        })
    })
  }

  copyTicket(ticketId: ITicket['_id'], userId: IAnalyst['_id']) {
    return new Promise((resolve, reject) => {
      Ticket.findOne({
        _id: ticketId
      }).exec((err: Error, ticket: ITicket) => {
        if (err) reject(err)
        const newTicket = new Ticket({
          openedBy: userId,
          actualUser: userId,
          affectedUser: ticket.affectedUser,
          resume: ticket.resume,
          content: ticket.content,
          status: ticket.status,
          group: ticket.group,
          category: ticket.category,
          priority: ticket.priority
        })
        resolve(this.create(newTicket))
      })
    })
  }

  updateOne(ticketId: ITicket['_id'], ticketBody: ITicket) {
    return new Promise((resolve, reject) => {
      Ticket.updateOne(
        {
          _id: ticketId
        },
        {
          $set: {
            status: ticketBody.status,
            group: ticketBody.group,
            resume: ticketBody.resume,
            content: ticketBody.content,
            category: ticketBody.category,
            actualUser: ticketBody.actualUser,
            affectedUser: ticketBody.affectedUser,
            priority: ticketBody.priority
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
  }

  create(ticketBody: ITicket): Promise<ITicket> {
    return new Promise((resolve, reject) => {
      const ticket = new Ticket({
        _id: new Types.ObjectId(),
        category: ticketBody.category,
        content: ticketBody.content,
        resume: ticketBody.resume,
        group: ticketBody.group,
        address: ticketBody.address,
        status: ticketBody.status,
        comments: ticketBody.comments,
        affectedUser: ticketBody.affectedUser,
        openedBy: ticketBody.openedBy,
        actualUser: ticketBody.actualUser,
        priority: ticketBody.priority,
        sla: ticketBody.sla,
        father: ticketBody.father,
        children: ticketBody.children,
        files: ticketBody.files,
        logs: ticketBody.logs
      })

      Ticket.create(ticket, async (err: Error, result: ITicket) => {
        if (err) return reject(err)
        const newTicket = await Ticket.findOne({ _id: result._id })
          .populate(populateArray)
          .exec()

        const notification = await Notification.create({
          _id: new Types.ObjectId(),
          name: 'TicketCreate',
          from: newTicket!.openedBy._id,
          to: newTicket!.group.analysts.map((a: IAnalyst) => a._id),
          content: `${newTicket!.openedBy.name} abriu um novo chamado`
        })
        return resolve(newTicket!)
      })
    })
  }

  changeStatus(
    ticketId: ITicket['_id'],
    statusId: IStatus['_id']
  ): Promise<ITicket> {
    return new Promise((resolve, reject) => {
      Ticket.updateOne(
        { _id: ticketId },
        {
          $set: {
            status: statusId
          }
        }
      ).exec(async error => {
        if (error) return reject(error)
        const ticket = await Ticket.findOne({
          _id: ticketId
        })
          .populate(populateArray)
          .exec()
        return resolve(ticket!)
      })
    })
  }

  transferToGroup(
    ticketId: ITicket['_id'],
    groupId: IGroup['_id']
  ): Promise<ITicket> {
    return new Promise(async (resolve, reject) => {
      Ticket.updateOne(
        { _id: ticketId },
        {
          $set: {
            group: groupId
          }
        }
      ).exec(async error => {
        if (error) return reject(error)
        const ticket = await Ticket.findOne({ _id: ticketId })
          .populate(populateArray)
          .exec()
        return resolve(ticket!)
      })
    })
  }

  commentOnTicket(
    ticketId: ITicket['_id'],
    userId: IAnalyst['_id'],
    content: string
  ) {
    return new Promise((resolve, reject) => {
      Comment.create(
        {
          _id: new Types.ObjectId(),
          user: userId,
          content: content
        },
        (err: Error, comment: IComment) => {
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
          ).exec((err: Error) => {
            if (err) return reject(err)
            Comment.findOne({
              _id: comment._id
            })
              .populate(['user'])
              .exec((err: Error, toReturn) => {
                if (err) return reject(err)
                return resolve(toReturn)
              })
          })
        }
      )
    })
  }

  removeChildren(
    ticketId: ITicket['_id'],
    childrenId: ITicket['_id']
  ): Promise<ITicket> {
    return new Promise((resolve, reject) => {
      Ticket.updateOne(
        {
          _id: ticketId
        },
        {
          $pull: {
            children: childrenId
          }
        }
      ).exec(error => {
        if (error) return reject(error)
        return resolve(this.getOne(ticketId))
      })
    })
  }

  addChildren(
    ticketId: ITicket['_id'],
    children: ITicket['_id'][]
  ): Promise<ITicket> {
    return new Promise((resolve, reject) => {
      if (children.includes(ticketId))
        return reject(new Error('Circular reference detected'))
      Ticket.updateOne(
        {
          _id: ticketId
        },
        {
          $addToSet: {
            children: children
          }
        }
      ).exec(error => {
        if (error) return reject(error)
        return resolve(this.getOne(ticketId))
      })
    })
  }

  insertFile(ticketId: ITicket['_id'], files: UploadedFile[]) {
    return new Promise(async (resolve, reject) => {
      const ticket = await Ticket.findOne({
        _id: ticketId
      }).exec()
      for (let i = 0; i < files.length; i++) {
        const f: UploadedFile = files[i]

        const name = `ticket/${ticketId}/${f.name} - ${i}`
        const params = {
          Bucket: process.env.BUCKET,
          Key: name,
          Body: f.data
        }
        await S3.upload(params).promise()

        ticket!.files.push({
          name: name,
          type: f.mimetype
        })
        await ticket!.save()
      }
      return resolve(ticket!.files)
    })
  }

  getFile(fileId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      S3.getObject(
        {
          Bucket: process.env.BUCKET,
          Key: fileId
        },
        (err: Error, file: AWS.S3.Types.GetObjectOutput) => {
          if (err) return reject(err)
          return resolve(file.Body)
        }
      )
    })
  }

  removeFile(ticketId: ITicket['_id'], fileId: IFile['_id']): Promise<ITicket> {
    return new Promise(async (resolve, reject) => {
      const ticket = await Ticket.findOne({
        _id: ticketId
      }).exec()
      S3.deleteObject(
        {
          Bucket: process.env.BUCKET,
          Key: fileId
        },
        (err: Error) => {
          if (err) return reject(err)
          ticket!.files = ticket!.files.filter((f: any) => {
            return f.name !== fileId
          })
          ticket!.save()
          return resolve(ticket!)
        }
      )
    })
  }
}

export default new TicketService()
