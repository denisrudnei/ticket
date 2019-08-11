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
          ...path
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
          ).exec((err, result) => {
            if (err) return reject(err)
            return resolve(result)
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
        return v.options.ref !== undefined
      })
      const onlyWithObjectId = pathsWithObjects.filter(o => {
        return o.instance === 'ObjectID'
      })
      const pathsWithRefs = onlyWithObjectId.map(v => ({
        path: v.path,
        options: getOptions(v.options.ref)
      }))
      return resolve(pathsWithRefs)
    })
  },

  getPaths(userId) {
    return new Promise((resolve, reject) => {
      function getId(base, path) {
        return base.map(v => {
          return v[path]._id
        })[0]
      }
      Analyst.findOne({
        _id: userId
      })
        .select('+paths')
        .populate('paths')
        .exec(async (err, user) => {
          if (err) return reject(err)
          const tickets = await Ticket.find({})
          const response = user.paths
            .map(leaf => {
              const base = _(tickets)
                .groupBy(leaf.fullPath)
                .value()
              const children = Object.keys(base)
                .filter(value => {
                  return value !== 'undefined'
                })
                .map(k => {
                  return {
                    id: `(${base[k].length}) ${k}`,
                    name: `(${base[k].length}) ${k}`,
                    url: `/search?${leaf.path}=${getId(base[k], leaf.path)}`,
                    children: []
                  }
                })
              return {
                _id: leaf._id,
                id: leaf.group,
                name: leaf.name,
                children: children
              }
            })
            .filter(value => {
              return value.children.length > 0
            })
          return resolve(response)
        })
    })
  },

  remove(id) {
    return new Promise((resolve, reject) => {
      Path.deleteOne({
        _id: id
      }).exec(err => {
        if (err) return reject(err)
        Analyst.updateMany(
          {},
          {
            $pull: {
              paths: {
                $in: [id]
              }
            }
          }
        ).exec(err => {
          if (err) return reject(err)
          resolve()
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
