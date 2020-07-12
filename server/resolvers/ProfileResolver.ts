import { Resolver, ID, Query, Arg, Authorized, Ctx } from 'type-graphql'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import PathService, { ProfileInfo, Ref } from '../services/PathService'

@Resolver()
class ProfileResolver {
  @Query(() => ProfileInfo)
  @Authorized('user')
  ProfileInfo(@Ctx() context: ExpressContext) {
    const userId = context.req.session!.authUser.id
    return PathService.getProfileInfo(userId)
  }

  @Query(() => [Ref])
  @Authorized('user')
  GetRefs() {
    return PathService.getRefs()
  }
}

export default ProfileResolver
