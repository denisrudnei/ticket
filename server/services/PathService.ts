import _ from 'lodash'
import mongoose, { Types } from 'mongoose'
import Path, { IPath } from '../models/Path'
import Analyst, { IAnalyst } from '../models/Analyst'
import Ticket from '../models/ticket/Ticket'

class Info {
  name: string

  total: number

  constructor(name: string, total: number) {
    this.name = name
    this.total = total
  }
}

export class ProfileInfo {
  opened: number | null

  total: number

  categories: Info[]

  status: Info[]

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

class PathTree {
  _id: Types.ObjectId

  id: string

  name: string

  children: any[]

  constructor(_id: Types.ObjectId, id: string, name: string, children: any[]) {
    this._id = _id
    this.id = id
    this.name = name
    this.children = children
  }
}

class PathService {
  create(path: IPath, userId: IAnalyst['_id']): Promise<PathTree> {
    return new Promise((resolve, reject) => {
      Path.create(
        {
          _id: new mongoose.Types.ObjectId(),
          name: path.name,
          objectName: path.objectName,
          property: path.property
        },
        (err: Error, path: IPath) => {
          if (err) return reject(err)
          Analyst.updateOne(
            {
              _id: userId
            },
            {
              $push: {
                paths: path
              }
            }
          ).exec((err: Error) => {
            if (err) return reject(err)
            return resolve(this.getOnePathTree(path._id))
          })
        }
      )
    })
  }

  getProfileInfo(userId: IAnalyst['_id']) {
    return new Promise((resolve, reject) => {
      Ticket.find({})
        .populate(['category', 'status', 'openedBy'])
        .exec((err: Error, tickets) => {
          if (err) return reject(err)
          const opened = tickets.filter(t => {
            return t.openedBy._id.toString() === userId
          }).length
          const total = tickets.length
          const categories = _(tickets)
            .groupBy('category')
            .map(v => ({
              name: v[0].category.fullName,
              total: v.length
            }))
            .value()
          const status = _(tickets)
            .groupBy('status')
            .map(v => ({
              name: v[0].status.name,
              total: v.length
            }))
            .value()
          const inName = _(tickets)
            .groupBy('actualUser')
            .map(v => ({
              name: v[0].actualUser._id,
              total: v.length
            }))
            .value()
            .filter((v: Info) => {
              return v.name === userId
            })

          return resolve(
            new ProfileInfo(opened, total, categories, status, inName)
          )
        })
    })
  }

  getAddress(userId: IAnalyst['_id']) {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        _id: userId
      })
        .populate('address')
        .exec((err: Error, analyst) => {
          if (err) return reject(err)
          return resolve(analyst.address)
        })
    })
  }

  getRefs() {
    return new Promise((resolve, reject) => {
      const paths = Object.values(Ticket.schema.path)
      const pathsWithObjects = paths.filter(v => {
        return v.options.ref !== undefined && v.options.ref !== null
      })
      const onlyWithObjectId = pathsWithObjects.filter(o => {
        return o.instance === 'ObjectID'
      })
      const pathsWithRefs = onlyWithObjectId.map(v => ({
        objectName: v.path,
        options: this.getOptions(v.options.ref)
      }))
      return resolve(pathsWithRefs)
    })
  }

  getPaths(userId: IAnalyst['_id']) {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        _id: userId
      })
        .select('+paths')
        .populate(['paths'])
        .exec((err: Error, result) => {
          if (err) reject(err)
          resolve(result.paths)
        })
    })
  }

  getOnePathTree(pathId: IPath['_id']): Promise<PathTree> {
    return new Promise((resolve, reject) => {
      function getId(object: any, property: string) {
        return object.map((value: any) => {
          return value[property]._id
        })[0]
      }
      Path.findOne({
        _id: pathId
      }).exec(async (err: Error, path) => {
        if (err) reject(err)
        const tickets = await Ticket.find({})
        const base = _(tickets)
          .groupBy(`${path.objectName}.${path.property}`)
          .value()
        const children = Object.keys(base)
          .filter(value => {
            return value !== 'undefined'
          })
          .map(k => {
            return {
              _id: `(${base[k].length}) ${k}`,
              name: `(${base[k].length}) ${k}`,
              url: `/search?${path.objectName}=${getId(
                base[k],
                path.objectName
              )}`,
              children: []
            }
          })
        const response = new PathTree(
          path._id,
          path.property,
          path.name,
          children
        )
        resolve(response)
      })
    })
  }

  getPathsTree(userId: IAnalyst['_id']): Promise<PathTree[]> {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        _id: userId
      })
        .select('+paths')
        .populate('paths')
        .exec((err: Error, user) => {
          if (err) return reject(err)
          const response: PathTree[] = user.paths.map((path: IPath) => {
            return this.getOnePathTree(path._id)
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

  remove(
    userId: IAnalyst['_id'],
    pathId: IPath['_id']
  ): Promise<IAnalyst['_id']> {
    return new Promise((resolve, reject) => {
      Path.deleteOne({
        _id: pathId
      }).exec((err: Error) => {
        if (err) return reject(err)
        Analyst.updateMany(
          {},
          {
            $pull: {
              paths: {
                $in: [pathId]
              }
            }
          }
        ).exec((err: Error) => {
          if (err) return reject(err)
          resolve(userId)
        })
      })
    })
  }

  getOptions(ref: string) {
    const model = require(this.getModule(ref))
    return Object.keys(model.schema.paths).filter(r => {
      return this.filterSelected(model.schema.paths, r)
    })
  }

  hasInstanceField(object: any) {
    return Object.prototype.hasOwnProperty.call(object, 'instance')
  }

  instanceIsString(object: any) {
    return object.instance === 'String'
  }

  isSelected(object: any) {
    if (Object.prototype.hasOwnProperty.call(object.options, 'select')) {
      return object.options.select
    }
    return true
  }

  filterSelected(paths: any, ref: string) {
    return (
      this.hasInstanceField(paths[ref]) &&
      this.instanceIsString(paths[ref]) &&
      this.isSelected(paths[ref])
    )
  }

  getModule(ref: string) {
    try {
      return require.resolve(`@models/ticket/${ref}`)
    } catch {
      return require.resolve(`@models/index/${ref}`)
    }
  }
}

export default new PathService()
