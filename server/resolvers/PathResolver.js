const { withFilter } = require('graphql-yoga')
const PathService = require('../services/PathService')
const PathEnum = require('../enums/PathEnum')
const Analyst = require('../models/Analyst')

const PathResolver = {
  Query: {
    Path: (_, __, { req }) => {
      const userId = req.session.authUser._id
      return PathService.getPaths(userId)
    },
    PathTree: (_, __, { req }) => {
      const userId = req.session.authUser._id
      return PathService.getPathsTree(userId)
    }
  },
  Mutation: {
    AddPath: (_, { path }, { req, pubSub }) => {
      const userId = req.session.authUser._id
      const result = PathService.create(path, userId)
      pubSub.publish(PathEnum.NEW_PATH_ADDED, {
        NewPath: result
      })
      return result
    },
    RemovePath: (_, { path, userId }, { pubSub }) => {
      const result = PathService.remove(userId, path)
      pubSub.publish(PathEnum.PATH_REMOVED, {
        RemovePath: result
      })
      return userId
    }
  },
  Subscription: {
    NewPath: {
      subscribe: withFilter(
        (_, __, { pubSub }) => {
          return pubSub.asyncIterator(PathEnum.NEW_PATH_ADDED)
        },
        async (payload, { userId }) => {
          const { NewPath } = await payload
          const result = await NewPath
          const user = await Analyst.findOne({
            _id: userId
          }).exec()
          return user.paths.includes(result._id.toString())
        }
      )
    },
    RemovePath: {
      subscribe: withFilter(
        (_, __, { pubSub }) => {
          return pubSub.asyncIterator(PathEnum.PATH_REMOVED)
        },
        async (payload, { userId }) => {
          const { RemovePath } = await payload
          const result = await RemovePath
          const user = await Analyst.findOne({
            _id: userId
          }).exec()
          return user._id.toString() === result.toString()
        }
      )
    }
  }
}

module.exports = PathResolver
