/* eslint-disable no-shadow */
import {
  Field, Float, ID, ObjectType,
} from 'type-graphql';
import {
  BaseEntity, Column, Entity, ManyToOne, PrimaryColumn,
} from 'typeorm';

import SoundType from '../enums/SoundTypeEnum';
import Analyst from './Analyst';

@Entity()
@ObjectType()
class Sound extends BaseEntity {
  constructor(soundType: SoundType, analystId: Analyst['id']) {
    super();
    this.type = soundType;
    this.id = `${soundType}-${analystId}`;
  }

  @PrimaryColumn()
  @Field(() => ID)
  public id!: string;

  @Field(() => SoundType)
  @Column()
  public type!: SoundType;

  @Field(() => Float)
  @Column()
  public volume: number = 0;

  @Field()
  @Column()
  public muted: boolean = false;

  @ManyToOne(() => Analyst, (Analyst) => Analyst.sounds)
  @Field(() => Analyst)
  public analyst!: Analyst;
}

export default Sound;
