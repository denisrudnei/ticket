import { Context } from 'graphql-yoga/dist/types'
import { withFilter } from 'graphql-yoga'
import PathService from '../services/PathService'
import PathEnum from '../enums/PathEnum'
import Analyst from '../models/Analyst'
import {IResolvers} from 'graphql-tools'

const PathResolver: IResolvers = {
  Query : {
    Path: (_: any, __: any, { req }: Context) => {
      const userId = req.session.authUser._id
      return PathService.getPaths(userId)
    },
    PathTree: (_: any, __: any, { req }: Context) => {
      const userId = req.session.authUser._id
      return PathService.getPathsTree(userId)
    }
  },
  Mutation : {
    AddPath: (_: any, { path }: any, { req, pubSub }: Context) => {
      const userId = req.session.authUser._id
      const result = PathService.create(path, userId)
      pubSub.publish(PathEnum.NEW_PATH_ADDED, {
        NewPath: result
      })
      return result
    },
    RemovePath: (_: any, { path, userId }: any, { pubSub }: Context) => {
      const result = PathService.remove(userId, path)
      pubSub.publish(PathEnum.PATH_REMOVED, {
        RemovePath: result
      })
      return userId
    }
  },
  Subscription : {
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

export default PathResolver
