import {
  Query,
  Resolver,
  Mutation,
  Ctx,
  Arg,
  ID,
  PubSubEngine,
  PubSub,
  Root,
  Subscription,
  Authorized
} from 'type-graphql'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import PathService, { PathTree } from '../services/PathService'
import PathEnum from '../enums/PathEnum'
import Analyst from '../models/Analyst'
import Path from '../models/Path'
import PathInput from '../inputs/PathInput'

@Resolver()
class PathResolver {
  @Query(() => [Path])
  @Authorized('user')
  Path(@Ctx() { req }: ExpressContext) {
    const userId = req!.session!.authUser.id
    return PathService.getPaths(userId)
  }

  @Query(() => [PathTree])
  @Authorized('user')
  PathTree(@Ctx() { req }: ExpressContext) {
    const userId = req!.session!.authUser.id
    return PathService.getPathsTree(userId)
  }

  @Mutation(() => PathTree)
  @Authorized('user')
  async AddPath(
    @Arg('path', () => PathInput) path: Path,
    @Ctx() { req }: ExpressContext,
    @PubSub() pubSub: PubSubEngine
  ) {
    const userId = req!.session!.authUser.id
    const result = await PathService.create(path, userId)
    pubSub.publish(PathEnum.NEW_PATH_ADDED, result)
    return result
  }

  @Mutation(() => Analyst)
  @Authorized('user')
  RemovePath(
    @Arg('path', () => ID) path: Path['id'],
    @Arg('userId', () => ID) userId: Analyst['id'],
    @PubSub() pubSub: PubSubEngine
  ) {
    const result = PathService.remove(userId, path)
    pubSub.publish(PathEnum.PATH_REMOVED, result)
    return userId
  }

  @Subscription({
    topics: PathEnum.NEW_PATH_ADDED
  })
  NewPath(@Root() pathPayload: PathTree): PathTree {
    return pathPayload
  }

  @Subscription({
    name: 'RemovePath',
    topics: PathEnum.PATH_REMOVED
  })
  RemovePathSubscription(@Root() pathPayload: PathTree): PathTree {
    return pathPayload
  }

  // Subscription: {
  //   NewPath: {
  //     subscribe: withFilter(
  //       (_, __, { pubSub }) => {
  //         return pubSub.asyncIterator(PathEnum.NEW_PATH_ADDED)
  //       },
  //       async (payload, { userId }) => {
  //         const { NewPath } = await payload
  //         const result = await NewPath
  //         const user = await Analyst.findOne(userId)
  //         return user!.paths.includes(result.id.toString())
  //       }
  //     )
  //   },
  //   RemovePath: {
  //     subscribe: withFilter(
  //       (_, __, { pubSub }) => {
  //         return pubSub.asyncIterator(PathEnum.PATH_REMOVED)
  //       },
  //       async (payload, { userId }) => {
  //         const { RemovePath } = await payload
  //         const result = await RemovePath
  //         const user = await Analyst.findOne(userId)
  //         return user!.id.toString() === result.toString()
  //       }
  //     )
  //   }
  // }
}

export default PathResolver
