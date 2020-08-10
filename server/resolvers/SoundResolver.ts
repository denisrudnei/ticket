/* eslint-disable class-methods-use-this */
import { Resolver, Query, Ctx } from 'type-graphql';

import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import SoundType from '../enums/SoundTypeEnum';
import Sound from '../models/Sound';
import Analyst from '../models/Analyst';

@Resolver()
class SoundResolver {
  @Query(() => [[String]])
  soundTypes() {
    return Object.entries(SoundType);
  }

  @Query(() => [Sound])
  async GetSounds(@Ctx() context: ExpressContext): Promise<Sound[]> {
    const { id } = context.req!.session!.authUser;

    const { sounds } = (await Analyst.findOne(id, { relations: ['sounds'] }) as Analyst);
    return sounds;
  }
}

export default SoundResolver;
