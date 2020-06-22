import lodash from 'lodash'
import { ObjectType, Field, Int } from 'type-graphql'
import Path from '../models/Path'
import Analyst from '../models/Analyst'
import Ticket from '../models/ticket/Ticket'
import Address from '../models/Address'

@ObjectType()
class Info {
  @Field()
  name: string

  @Field(() => Int)
  total: number

  constructor(name: string, total: number) {
    this.name = name
    this.total = total
  }
}

@ObjectType()
export class Ref {
  constructor(objectName: string, options: string[]) {
    this.objectName = objectName
    this.options = options
  }

  @Field()
  public objectName!: string

  @Field(() => [String])
  public options!: string[]
}

@ObjectType()
export class ProfileInfo {
  @Field(() => Int)
  opened: number = 0

  @Field(() => Int)
  total: number

  @Field(() => [Info])
  categories: Info[]

  @Field(() => [Info])
  status: Info[]

  @Field(() => [Info])
  inName: Info[]

  constructor(
    opened: number,
    total: number,
    categories: Info[],
    status: Info[],
    inName: Info[]
  ) {
    this.opened = opened
    this.total = total
    this.categories = categories
    this.status = status
    this.inName = inName
  }
}

@ObjectType()
export class PathTree {
  @Field()
  public id: string

  @Field()
  public name: string = ''

  @Field()
  public url!: string

  @Field(type => [PathTree])
  children: PathTree[]

  constructor(name: string, url: string, children: PathTree[]) {
    this.id = name
    this.name = name
    this.url = url
    this.children = children
  }
}

enum TicketObjects {
  'category' = 'category',
  'group' = 'group',
  'address' = 'address',
  'status' = 'status',
  'affectedUser' = 'affectedUser',
  'openedBy' = 'openedBy',
  'actualUser' = 'actualUser',
  'priority' = 'priority'
}

class PathService {
  create(pathToCreate: Path, userId: Analyst['id']): Promise<PathTree> {
    return new Promise((resolve, reject) => {
      const path = Path.create()
      path.name = pathToCreate.name
      path.objectName = pathToCreate.objectName
      path.property = pathToCreate.property
      path.save().then((path: Path) => {
        Analyst.findOne(userId, { relations: ['paths'] }).then(analyst => {
          analyst!.paths.push(path)
          analyst!.save().then(() => {
            resolve(this.getOnePathTree(path.id))
          })
        })
      })
    })
  }

  getProfileInfo(userId: Analyst['id']): Promise<ProfileInfo> {
    return new Promise((resolve, reject) => {
      Ticket.find({}).then(tickets => {
        const opened = tickets.filter(t => {
          return t.openedBy.id === userId
        }).length
        const total = tickets.length
        const groupedByCategory = lodash.groupBy(tickets, 'category.name')
        const categories = Object.keys(groupedByCategory).map(name => {
          return new Info(name, groupedByCategory[name].length)
        })
        const groupedByStatus = lodash.groupBy(tickets, 'status.name')
        const status = Object.keys(groupedByStatus).map(name => {
          return new Info(name, groupedByStatus[name].length)
        })
        const groupedByInName = lodash.groupBy(tickets, 'actualUser.name')
        const inName = Object.keys(groupedByInName).map(name => {
          return new Info(name, groupedByInName[name].length)
        })
        // .filter(v => {
        //   return v.name === userId
        // })[0]
        return resolve(
          new ProfileInfo(opened, total, categories, status, inName)
        )
      })
    })
  }

  getAddress(userId: Analyst['id']): Promise<Address | null> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(userId, { relations: ['address'] }).then(analyst => {
        return resolve(analyst!.address)
      })
    })
  }

  getRefs(): Promise<Ref[]> {
    return new Promise((resolve, reject) => {
      Ticket.findOne().then(ticket => {
        const result = Object.values(TicketObjects).map(property => {
          return new Ref(property, this.getOptions(ticket![property]))
        })
        resolve(result)
      })
    })
  }

  getPaths(userId: Analyst['id']) {
    return new Promise((resolve, reject) => {
      Analyst.findOne(userId, { relations: ['paths'] }).then(result => {
        resolve(result!.paths)
      })
    })
  }

  getOnePathTree(pathId: Path['id']): Promise<PathTree> {
    return new Promise((resolve, reject) => {
      // FIXME
      function getId(object: any, property: string) {
        return object.map((value: any) => {
          return value[property].id
        })[0]
      }
      Path.findOne(pathId).then(async path => {
        const tickets = await Ticket.find()
        const base = lodash.groupBy(
          tickets,
          `${path!.objectName}.${path!.property}`
        )
        const children = Object.keys(base)
          .filter(value => {
            return value !== 'undefined'
          })
          .map(k => {
            return new PathTree(
              `(${base[k].length}) ${k}`,
              `/search?${path!.objectName}=${getId(base[k], path!.objectName)}`,
              []
            )
          })
        resolve(new PathTree(path!.name, '', children))
      })
    })
  }

  getPathsTree(userId: Analyst['id']): Promise<PathTree[]> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(userId, { relations: ['paths'] }).then(user => {
        const response: Promise<PathTree>[] = user!.paths.map((path: Path) => {
          return this.getOnePathTree(path.id)
        })
        Promise.all(response).then(results => {
          const result = results.filter(value => {
            return value.children.length > 0
          })
          return resolve(result)
        })
      })
    })
  }

  remove(userId: Analyst['id'], pathId: Path['id']): Promise<Path> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(userId, { relations: ['paths'] }).then(analyst => {
        analyst!.paths = analyst!.paths.filter(path => {
          return path.id !== pathId
        })
        analyst!.save().then(async () => {
          const path = await Path.findOne(pathId)
          await Path.delete(pathId)

          resolve(path)
        })
      })
    })
  }

  getOptions(ref: any): string[] {
    return Object.getOwnPropertyNames(ref).filter(property => {
      return typeof ref[property] === 'string'
    })
  }
}

export default new PathService()
