import { Field, Float, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

import { SoundType } from '../enums/SoundTypeEnum'
import Analyst from './Analyst'

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
  @Column()
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
