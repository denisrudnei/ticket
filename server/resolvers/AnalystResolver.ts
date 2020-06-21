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

@Resolver(of => Analyst)
class AnalystResolver {
  @Query(() => [Analyst])
  @Authorized('user')
  Analyst() {
    return AnalystService.getAnalysts()
  }

  @Mutation(() => Analyst)
  @Authorized('user')
  UpdateAnalyst(
    @Arg('analyst', () => AnalystInput) analyst: Analyst,
    @Ctx() context: ExpressContext
  ): Promise<Analyst> {
    const id = context.req!.session!.authUser.id
    return AnalystService.updateAnalyst(id, analyst)
  }

  @Mutation(() => Analyst)
  @Authorized('user')
  RemoveImage(@Arg('id', () => ID) id: Analyst['id']): Promise<Analyst> {
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
