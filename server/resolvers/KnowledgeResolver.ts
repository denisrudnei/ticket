import {
  Resolver,
  Query,
  Arg,
  ID,
  FieldResolver,
  Root,
  Authorized
} from 'type-graphql'
import KnowledgeService from '../services/knowledge/KnowledgeService'
import Knowledge from '../models/knowledge/Knowledge'
import Group from '../models/ticket/Group'
import Status from '../models/ticket/Status'
import Category from '../models/ticket/Category'

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
