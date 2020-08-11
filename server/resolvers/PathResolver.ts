/* eslint-disable class-methods-use-this */
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import {
  Arg, Authorized, Ctx, ID, Mutation, PubSub, PubSubEngine, Query, Resolver, Root, Subscription,
} from 'type-graphql';

import PathEnum from '../enums/PathEnum';
import PathInput from '../inputs/PathInput';
import Analyst from '../models/Analyst';
import Path from '../models/Path';
import PathService from '../services/path/PathService';
import PathTree from '../services/path/PathTree';

@Resolver()
class PathResolver {
  @Query(() => [Path])
  @Authorized('user')
  Path(@Ctx() { req }: ExpressContext) {
    const userId = req!.session!.authUser.id;
    return PathService.getPaths(userId);
  }

  @Query(() => [PathTree])
  @Authorized('user')
  PathTree(@Ctx() { req }: ExpressContext) {
    const userId = req!.session!.authUser.id;
    return PathService.getPathsTree(userId);
  }

  @Mutation(() => PathTree)
  @Authorized('user')
  async AddPath(
    @Arg('path', () => PathInput) path: Path,
    @Ctx() context: ExpressContext,
    @PubSub() pubSub: PubSubEngine,
  ) {
    const userId = context.req!.session!.authUser.id;
    const result = await PathService.create(path, userId);
    await pubSub.publish(PathEnum.NEW_PATH_ADDED, result);
    return result;
  }

  @Mutation(() => Path)
  @Authorized('user')
  RemovePath(
    @Arg('path', () => ID) path: Path['id'],
    @Arg('userId', () => ID) userId: Analyst['id'],
    @PubSub() pubSub: PubSubEngine,
  ) {
    const result = PathService.remove(userId, path);
    pubSub.publish(PathEnum.PATH_REMOVED, result);
    return result;
  }

  @Subscription({
    topics: PathEnum.NEW_PATH_ADDED,
    filter: async ({ payload, args, context }) => {
      const { userId } = args;
      const user = await Analyst.findOne(userId, { relations: ['paths'] });
      return user!.paths.map((path) => path.id).includes(user!.id);
    },
  })
  NewPath(
    @Root() pathPayload: PathTree,
    @Arg('userId', () => ID) userId: Analyst['id'],
  ): PathTree {
    return pathPayload;
  }

  @Subscription({
    name: 'RemovePath',
    topics: PathEnum.PATH_REMOVED,
  })
  RemovePathSubscription(
    @Root() pathPayload: Path,
    @Arg('userId', () => ID) userId: Analyst['id'],
  ): Path {
    return pathPayload;
  }
}

export default PathResolver;
