import {
  Arg,
  Authorized,
  FieldResolver,
  ID,
  Query,
  Resolver,
  Root,
  Mutation
} from 'type-graphql'

import Knowledge from '../models/knowledge/Knowledge'
import Category from '../models/ticket/Category'
import Group from '../models/ticket/Group'
import KnowledgeService from '../services/knowledge/KnowledgeService'
import KnowledgeInput from '../inputs/KnowledgeInput'
import KnowledgeStatus from '../models/knowledge/KnowledgeStatus'

@Resolver(of => Knowledge)
class KnowledgeResolver {
  @Query(() => [Knowledge])
  @Authorized('user')
  Knowledge() {
    return KnowledgeService.getAll()
  }

  @Query(() => [Knowledge])
  @Authorized('user')
  KnowledgeByGroup(@Arg('groupName') groupName: string) {
    return KnowledgeService.getByKnowledgeGroup(groupName)
  }

  @Query(() => Knowledge)
  @Authorized('user')
  KnowledgeById(@Arg('id', () => ID) id: Knowledge['id']) {
    return KnowledgeService.getOne(id)
  }

  @Mutation(() => Knowledge)
  @Authorized('user')
  CreateKnowledge(
    @Arg('knowledge', () => KnowledgeInput) knowledge: Knowledge
  ) {
    return KnowledgeService.create(knowledge)
  }

  @Mutation(() => Boolean)
  @Authorized('user')
  RemoveKnowledge(@Arg('id', () => ID) id: Knowledge['id']) {
    return KnowledgeService.remove(id)
  }

  @FieldResolver()
  status(@Root() root: Knowledge): Promise<KnowledgeStatus> {
    return new Promise((resolve, reject) => {
      Knowledge.findOne(root.id, { relations: ['status'] }).then(knowledge => {
        resolve(knowledge!.status)
      })
    })
  }

  @FieldResolver()
  group(@Root() root: Knowledge): Promise<Group> {
    return new Promise((resolve, reject) => {
      Knowledge.findOne(root.id, { relations: ['group'] }).then(knowledge => {
        resolve(knowledge!.group)
      })
    })
  }

  @FieldResolver()
  category(@Root() root: Knowledge): Promise<Category> {
    return new Promise((resolve, reject) => {
      Knowledge.findOne(root.id, { relations: ['category'] }).then(
        knowledge => {
          resolve(knowledge!.category)
        }
      )
    })
  }
}

export default KnowledgeResolver
