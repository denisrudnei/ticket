import { Resolver, Query, Authorized } from 'type-graphql'
import PathService, { Ref } from '../services/PathService'
@Resolver()
class RefResolver {
  @Query(() => [Ref])
  @Authorized('user')
  Ref() {
    return PathService.getRefs()
  }
}

export default RefResolver
