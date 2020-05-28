import {
  Authorized,
  FieldResolver,
  Query,
  Resolver,
  Root,
  ResolverInterface
} from 'type-graphql'
import Analyst from '../models/Analyst'
import Chat from '../models/chat/Chat'
import { Path } from '../models/Path'
import Sound from '../models/Sound'
import Group from '../models/ticket/Group'
import AnalystService from '../services/AnalystService'

@Resolver(of => Analyst)
class AnalystResolver {
  @Query(() => [Analyst])
  @Authorized('user')
  Analyst() {
    return AnalystService.getAnalysts()
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
