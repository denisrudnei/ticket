import {
  Arg,
  Authorized,
  FieldResolver,
  ID,
  Query,
  Resolver,
  Root
} from 'type-graphql'

import Knowledge from '../models/knowledge/Knowledge'
import Category from '../models/ticket/Category'
import Group from '../models/ticket/Group'
import KnowledgeService from '../services/knowledge/KnowledgeService'

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
