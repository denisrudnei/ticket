import { Types } from 'mongoose'
import Ticket from '@/server/models/ticket/Ticket'

class ReportService {
  private filter(attributes: any): any {
    const value = Object.keys(attributes).filter(key => {
      return attributes[key].length !== 0
    })
    if (value.length === 0) return {}
    return {
      $and: value.map(key => {
        return {
          [key]: {
            $in: attributes[key].map((value: string) => {
              return new Types.ObjectId(value)
            })
          }
        }
      })
    }
  }

  reportGrouped(
    attributes: any = {},
    field: string,
    ref: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!Object.keys(Ticket.schema.obj).includes(field)) {
        reject(new Error('Field not exist'))
      }

      const filterKeys = Object.keys(Ticket.schema.obj)
      filterKeys.push('ticketNumber')
      Object.keys(attributes).forEach(inQuery => {
        if (!filterKeys.includes(inQuery)) delete attributes[inQuery]
      })

      Ticket.aggregate(
        [
          {
            $match: this.filter(attributes)
          },
          {
            $project: {
              [field]: 1
            }
          },
          {
            $group: {
              _id: `$${field}`,
              total: {
                $sum: 1
              }
            }
          },
          {
            $lookup: {
              from: ref,
              localField: '_id',
              foreignField: '_id',
              as: 'value'
            }
          }
        ],
        (err: Error, result: any) => {
          if (err) return reject(err)
          resolve(result)
        }
      )
    })
  }

  reportByDate(
    field: string,
    start = Date.now(),
    end = Date.now()
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      Ticket.aggregate(
        [
          {
            $match: {
              [field]: {
                $lte: new Date(end),
                $gte: new Date(start)
              }
            }
          },
          {
            $project: {
              [field]: 1,
              year: {
                $year: `$${field}`
              },
              month: {
                $month: `$${field}`
              },
              dayOfMonth: {
                $dayOfMonth: `$${field}`
              }
            }
          },
          {
            $group: {
              _id: {
                $dateFromParts: {
                  year: '$year',
                  month: '$month',
                  day: '$dayOfMonth'
                }
              },
              total: {
                $sum: 1
              }
            }
          }
        ],
        (error: Error, result: any) => {
          if (error) return reject(error)
          return resolve(result)
        }
      )
    })
  }
}

export default new ReportService()
