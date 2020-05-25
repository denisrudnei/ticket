import { BaseEntity, PrimaryGeneratedColumn, Entity, Column } from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'

@Entity()
@ObjectType()
class KnowledgeStatus extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  public id!: number

  @Column()
  @Field(type => String)
  public name!: string

  @Column()
  public description!: string
}

export default KnowledgeStatus
