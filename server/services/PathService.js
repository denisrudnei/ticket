const _ = require('lodash')
const mongoose = require('mongoose')
const Path = require('../models/Path')
const Analyst = require('../models/Analyst')
const Ticket = require('../models/Ticket')

const PathService = {
  create(path, userId, callback) {
    Path.create(
      {
        _id: new mongoose.Types.ObjectId(),
        ...path
      },
      (err, path) => {
        if (err) return callback(err, null)
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
          return callback(err, result)
        })
      }
    )
  },

  getProfileInfo(userId, callback) {
    const result = {}
    Ticket.find({})
      .populate(['category', 'status', 'openedBy'])
      .exec((err, tickets) => {
        if (err) return callback(err, null)
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
        return callback(err, result)
      })
  },

  getAddress(userId) {
    Analyst.findOne({
      _id: userId
    })
      .populate('address')
      .exec((err, analyst) => {
        if (err) return err
        return analyst.address
      })
  },

  getRefs(callback) {
    const paths = Object.values(Ticket.schema.paths)
    const pathsWithObjects = paths.filter(v => {
      return v.options.ref !== undefined
    })
    const pathsWithRefs = pathsWithObjects.map(v => ({
      path: v.path,
      options: Object.keys(require(`../models/${v.options.ref}`).schema.paths)
    }))
    return callback(null, pathsWithRefs)
  },

  getPaths(userId, callback) {
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
        if (err) return callback(err, null)
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
        return callback(null, response)
      })
  },

  remove(id, callback) {
    Path.deleteOne({
      _id: id
    }).exec(err => {
      return callback(err, null)
    })
  }
}

module.exports = PathService
