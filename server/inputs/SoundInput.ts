import { InputType, Field, Float } from 'type-graphql'
import SoundType from '../enums/SoundTypeEnum'

@InputType()
class SoundInput {
  @Field(() => SoundType)
  public type!: SoundType

  @Field(() => Float)
  public volume: number = 0

  @Field()
  public muted: boolean = false
}

export default SoundInput
