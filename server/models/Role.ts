import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { Field, ObjectType, ID } from 'type-graphql'

@Entity()
@ObjectType()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  public id!: number

  @Column()
  @Field()
  public name!: string

  @Column()
  @Field()
  public description!: string
}

export default Role
