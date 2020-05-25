import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import Knowledge from './Knowledge'

@Entity()
@ObjectType()
class KnowledgeFile extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  public id!: number

  @Column()
  @Field(type => String)
  public name!: string

  @Column()
  @Field(type => String)
  public url: string = ''

  @ManyToOne(type => Knowledge, Knowledge => Knowledge.files)
  @Field(type => Knowledge)
  public knowledge!: Knowledge
}

export default KnowledgeFile
