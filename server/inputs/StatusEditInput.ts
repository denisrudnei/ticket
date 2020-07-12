import { InputType, Field, ID } from 'type-graphql'
import Status from '../models/ticket/Status'

@InputType()
class StatusEditInput {
  @Field({ nullable: true })
  public name?: string

  @Field({ nullable: true })
  public description?: string

  @Field(() => [ID], { nullable: true })
  public allowedStatus: Status['id'][] = []

  @Field(() => Boolean, { nullable: true })
  public slaRun = false
}
export default StatusEditInput
