/* eslint-disable class-methods-use-this */
import {
  Authorized, Ctx, Query, Resolver,
} from 'type-graphql';
import { CustomExpressContext } from '~/server/types/UserSession';

import PathService from '../services/path/PathService';
import ProfileInfo from '../services/path/ProfileInfo';
import Ref from '../services/path/Ref';

@Resolver()
class ProfileResolver {
  @Query(() => ProfileInfo)
  @Authorized('user')
  ProfileInfo(@Ctx() context: CustomExpressContext) {
    const userId = context.req.session!.authUser!.id;
    return PathService.getProfileInfo(userId);
  }

  @Query(() => [Ref])
  @Authorized('user')
  GetRefs() {
    return PathService.getRefs();
  }
}

export default ProfileResolver;
