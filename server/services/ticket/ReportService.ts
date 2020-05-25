import Ticket from '@/server/models/ticket/Ticket'
import { DeepPartial, LessThanOrEqual, MoreThanOrEqual } from 'typeorm'
import lodash from 'lodash'
import { ObjectType, Field, Int, ID } from 'type-graphql'

@ObjectType()
export class ReportByDate {
  constructor(date: string, total: number) {
    this.id = date
    this.date = date
    this.total = total
  }

  @Field(() => ID)
  public id!: string

  @Field()
  public date!: string

  @Field(type => Int)
  public total!: number
}

export class ComposedDate {
  constructor(day: number, month: number, year: number) {
    this.day = day
    this.month = month
    this.year = year
  }

  public day!: number

  public month!: number

  public year!: number
}

class TicketWithComposedDate extends Ticket {
  constructor(ticketBase: Ticket, composedDate: ComposedDate) {
    super()
    Object.assign(this, ticketBase)
    this.composedDate = `${composedDate.day}/${composedDate.month}/${
      composedDate.year
    }`
  }

  public composedDate!: string
}

@ObjectType()
export class GroupedResult {
  constructor(name: string, total: number) {
    this.id = name
    this.name = name
    this.total = total
  }

  @Field(() => ID)
  public id!: string

  @Field()
  public name!: string

  @Field(type => Int)
  public total!: number
}

export enum TicketTimeField {
  created = 'created',
  modified = 'modified'
}

class ReportService {
  reportGrouped(
    attributes: DeepPartial<Ticket>,
    field: string
  ): Promise<GroupedResult[]> {
    return new Promise((resolve, reject) => {
      // attributes
      Ticket.find({}).then(tickets => {
        const grouped = lodash.groupBy(tickets, `${field}.name`)
        const result = Object.keys(grouped).map(name => {
          return new GroupedResult(name, grouped[name].length)
        })
        resolve(result)
      })
    })
  }

  reportByDate(
    field: TicketTimeField,
    start = new Date(),
    end = new Date()
  ): Promise<ReportByDate[]> {
    return new Promise((resolve, reject) => {
      // {
      //   where: {
      //     [field]: MoreThanOrEqual(start),
      //     [field]: LessThanOrEqual(end)
      //   }
      // }
      Ticket.find().then(tickets => {
        const ticketsWithNewDates = tickets.map(ticket => {
          const [year, month, day] = ticket[field]
            .toISOString()
            .split('T')[0]
            .split('-')
            .map(value => parseInt(value))
          const composedDate = new ComposedDate(day, month, year)

          return new TicketWithComposedDate(ticket, composedDate)
        })
        const grouped = lodash.groupBy(ticketsWithNewDates, 'composedDate')
        const result = Object.keys(grouped).map(name => {
          return new ReportByDate(name, grouped[name].length)
        })

        resolve(result)
      })
    })
  }
}

export default new ReportService()
