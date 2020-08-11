/* eslint-disable class-methods-use-this */
import { Authorized, Query, Resolver } from 'type-graphql';

import PathService from '../services/path/PathService';
import Ref from '../services/path/Ref';

@Resolver()
class RefResolver {
  @Query(() => [Ref])
  @Authorized('user')
  Ref() {
    return PathService.getRefs();
  }
}

export default RefResolver;
