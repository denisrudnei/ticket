import {
  Authorized,
  FieldResolver,
  Query,
  Resolver,
  Root,
  Mutation,
  Arg,
  ID,
  Ctx
} from 'type-graphql'
import { GraphQLUpload } from 'graphql-upload'
import { UploadedFile } from 'express-fileupload'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import Analyst from '../models/Analyst'
import Chat from '../models/chat/Chat'
import { Path } from '../models/Path'
import Sound from '../models/Sound'
import Group from '../models/ticket/Group'
import AnalystService from '../services/AnalystService'
import AnalystInput from '../inputs/AnalystInput'
import { Role } from '../models/Role'
import SoundInput from '../inputs/SoundInput'

@Resolver(of => Analyst)
class AnalystResolver {
  @Query(() => [Analyst])
  @Authorized('user')
  Analyst() {
    return AnalystService.getAnalysts()
  }

  @Query(() => Analyst)
  @Authorized('user')
  AnalystById(@Arg('id', () => ID) id: Analyst['id']) {
    return AnalystService.getOne(id)
  }

  @Mutation(() => Analyst)
  @Authorized('user')
  UpdateAnalyst(
    @Arg('analyst', () => AnalystInput) analyst: AnalystInput,
    @Ctx() context: ExpressContext
  ): Promise<Analyst> {
    const id = context.req!.session!.authUser.id
    const analystToEdit = new Analyst()
    Object.assign(analystToEdit, analyst)
    return AnalystService.updateAnalyst(id, analystToEdit)
  }

  @Mutation(() => Analyst)
  @Authorized('user')
  RemoveImage(@Ctx() context: ExpressContext): Promise<Analyst> {
    const id = context.req!.session!.authUser.id
    return AnalystService.removeImage(id)
  }

  @Mutation(() => Analyst)
  @Authorized('user')
  UpdateImage(
    @Arg('file', () => GraphQLUpload) file: UploadedFile,
    @Ctx() context: ExpressContext
  ): Promise<Analyst> {
    const id = context!.req!.session!.authUser.id
    return AnalystService.updateImage(id, file)
  }

  @Mutation(() => Analyst)
  @Authorized('user')
  SetSoundConfig(
    @Arg('config', () => [SoundInput]) config: SoundInput[],
    @Ctx() context: ExpressContext
  ) {
    const userId = context.req!.session!.authUser.id
    const newConfig = config.map(sound => {
      const toReturn = new Sound(sound.type, userId)
      toReturn.muted = sound.muted
      toReturn.volume = sound.volume
      toReturn.type = sound.type
      return toReturn
    })
    return AnalystService.setSoundConfig(userId, newConfig)
  }

  @FieldResolver()
  chats(@Root() root: Analyst): Promise<Chat[]> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(root.id, { relations: ['chats'] }).then(analyst => {
        resolve(analyst!.chats)
      })
    })
  }

  @FieldResolver()
  groups(@Root() root: Analyst): Promise<Group[]> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(root.id, { relations: ['groups'] }).then(analyst => {
        resolve(analyst!.groups)
      })
    })
  }

  @FieldResolver()
  role(@Root() root: Analyst): Promise<Role> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(root.id, { relations: ['role'] }).then(analyst => {
        resolve(analyst!.role)
      })
    })
  }

  @FieldResolver()
  paths(@Root() root: Analyst): Promise<Path[]> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(root.id, { relations: ['paths'] }).then(analyst => {
        resolve(analyst!.paths)
      })
    })
  }

  @FieldResolver()
  sounds(@Root() root: Analyst): Promise<Sound[]> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(root.id, { relations: ['sounds'] }).then(analyst => {
        resolve(analyst!.sounds)
      })
    })
  }
}

export default AnalystResolver
