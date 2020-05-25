import {
  Entity,
  BaseEntity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm'
import { ObjectType, Field, ID, Float } from 'type-graphql'
import Analyst from './Analyst'

export enum SoundType {
  NOTIFICATION = 'NOTIFICATION',
  CHAT = 'CHAT'
}

@Entity()
@ObjectType()
class Sound extends BaseEntity {
  constructor(soundType: SoundType) {
    super()
    this.type = soundType
  }

  @PrimaryGeneratedColumn()
  @Field(type => ID)
  public id!: number

  @Field()
  public type!: SoundType

  @Field(type => Float)
  @Column()
  public volume: number = 0

  @Field()
  @Column()
  public muted: boolean = false

  @ManyToOne(type => Analyst, Analyst => Analyst.sounds)
  @Field(type => Analyst)
  public analyst!: Analyst
}

export default Sound
