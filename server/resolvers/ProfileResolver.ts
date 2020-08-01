/* eslint-disable class-methods-use-this */
import {
  Resolver, ID, Query, Arg, Authorized, Ctx,
} from 'type-graphql';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import PathService from '../services/path/PathService';
import ProfileInfo from '../services/path/ProfileInfo';
import Ref from '../services/path/Ref';

@Resolver()
class ProfileResolver {
  @Query(() => ProfileInfo)
  @Authorized('user')
  ProfileInfo(@Ctx() context: ExpressContext) {
    const userId = context.req.session!.authUser.id;
    return PathService.getProfileInfo(userId);
  }

  @Query(() => [Ref])
  @Authorized('user')
  GetRefs() {
    return PathService.getRefs();
  }
}

export default ProfileResolver;
