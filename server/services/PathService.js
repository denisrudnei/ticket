const _ = require('lodash')
const mongoose = require('mongoose')
const Path = require('../models/Path')
const Analyst = require('../models/Analyst')
const Ticket = require('../models/ticket/Ticket')
const PathService = {
  create(path, userId) {
    return new Promise((resolve, reject) => {
      Path.create(
        {
          _id: new mongoose.Types.ObjectId(),
          name: path.name,
          objectName: path.objectName,
          property: path.property
        },
        (err, path) => {
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
          ).exec(err => {
            if (err) return reject(err)
            return resolve(this.getOnePathTree(path._id))
          })
        }
      )
    })
  },

  getProfileInfo(userId) {
    return new Promise((resolve, reject) => {
      const result = {}
      Ticket.find({})
        .populate(['category', 'status', 'openedBy'])
        .exec((err, tickets) => {
          if (err) return reject(err)
          result.opened = tickets.filter(t => {
            return t.openedBy._id.toString() === userId
          }).length
          result.total = tickets.length
          result.categories = _(tickets)
            .groupBy('category')
            .map(v => ({
              name: v[0].category.fullName,
              total: v.length
            }))
          result.status = _(tickets)
            .groupBy('status')
            .map(v => ({
              name: v[0].status.name,
              total: v.length
            }))
          result.inName = _(tickets)
            .groupBy('actualUser')
            .map(v => ({
              id: v[0].actualUser._id,
              total: v.length
            }))
            .find(v => {
              return v.id === userId
            })
          return resolve(result)
        })
    })
  },

  getAddress(userId) {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        _id: userId
      })
        .populate('address')
        .exec((err, analyst) => {
          if (err) return reject(err)
          return resolve(analyst.address)
        })
    })
  },

  getRefs() {
    return new Promise((resolve, reject) => {
      const paths = Object.values(Ticket.schema.paths)
      const pathsWithObjects = paths.filter(v => {
        return v.options.ref !== undefined && v.options.ref !== null
      })
      const onlyWithObjectId = pathsWithObjects.filter(o => {
        return o.instance === 'ObjectID'
      })
      const pathsWithRefs = onlyWithObjectId.map(v => ({
        objectName: v.path,
        options: getOptions(v.options.ref)
      }))
      return resolve(pathsWithRefs)
    })
  },

  getPaths(userId) {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        _id: userId
      })
        .select('+paths')
        .populate(['paths'])
        .exec((err, result) => {
          if (err) reject(err)
          resolve(result.paths)
        })
    })
  },

  getOnePathTree(pathId) {
    return new Promise((resolve, reject) => {
      function getId(object, property) {
        return object.map(value => {
          return value[property]._id
        })[0]
      }
      Path.findOne({
        _id: pathId
      }).exec(async (err, path) => {
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
        const response = {
          _id: path._id,
          id: path.property,
          name: path.name,
          children: children
        }
        resolve(response)
      })
    })
  },
  getPathsTree(userId) {
    return new Promise((resolve, reject) => {
      Analyst.findOne({
        _id: userId
      })
        .select('+paths')
        .populate('paths')
        .exec(async (err, user) => {
          if (err) return reject(err)
          const response = user.paths.map(path => {
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
  },

  remove(userId, pathId) {
    return new Promise((resolve, reject) => {
      Path.deleteOne({
        _id: pathId
      }).exec(err => {
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
        ).exec(err => {
          if (err) return reject(err)
          resolve(userId)
        })
      })
    })
  }
}

function getOptions(ref) {
  const model = require(getModule(ref))
  return Object.keys(model.schema.paths).filter(r => {
    return filterSelected(model.schema.paths, r)
  })
}

function hasInstanceField(object) {
  return Object.prototype.hasOwnProperty.call(object, 'instance')
}

function instanceIsString(object) {
  return object.instance === 'String'
}

function isSelected(object) {
  if (Object.prototype.hasOwnProperty.call(object.options, 'select')) {
    return object.options.select
  }
  return true
}

function filterSelected(paths, ref) {
  return (
    hasInstanceField(paths[ref]) &&
    instanceIsString(paths[ref]) &&
    isSelected(paths[ref])
  )
}

function getModule(ref) {
  try {
    return require.resolve(`@models/ticket/${ref}`)
  } catch {
    return require.resolve(`@models/index/${ref}`)
  }
}

module.exports = PathService
