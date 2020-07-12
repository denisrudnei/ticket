import { Resolver, Query, Ctx } from 'type-graphql'

import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import SoundType from '../enums/SoundTypeEnum'
import Sound from '../models/Sound'
import Analyst from '../models/Analyst'

@Resolver()
class SoundResolver {
  @Query(() => [[String]])
  soundTypes() {
    return Object.entries(SoundType)
  }

  @Query(() => [Sound])
  GetSounds(@Ctx() context: ExpressContext): Promise<Sound[]> {
    const id = context.req!.session!.authUser.id
    return new Promise((resolve, reject) => {
      Analyst.findOne(id, { relations: ['sounds'] }).then(analyst => {
        resolve(analyst!.sounds)
      })
    })
  }
}

export default SoundResolver
