/* eslint-disable class-methods-use-this */
import {
  Ctx, Query, Resolver, Authorized,
} from 'type-graphql';
import { ExpressContext } from '~/server/types/UserSession';

import SoundType from '../enums/SoundTypeEnum';
import Analyst from '../models/Analyst';
import Sound from '../models/Sound';

@Resolver()
class SoundResolver {
  @Query(() => [[String]])
  soundTypes() {
    return Object.entries(SoundType);
  }

  @Query(() => [Sound])
  @Authorized('user')
  async GetSounds(@Ctx() context: ExpressContext): Promise<Sound[]> {
    const { id } = context.req!.session!.authUser!;

    const { sounds } = (await Analyst.findOne(id, { relations: ['sounds'] }) as Analyst);
    return sounds;
  }
}

export default SoundResolver;
