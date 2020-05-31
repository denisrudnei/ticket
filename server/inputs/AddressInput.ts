import { InputType, Field, ID } from 'type-graphql'

@InputType()
class AddressInput {
  @Field(type => ID, { nullable: true })
  public id!: number

  @Field({ nullable: true })
  public name!: string

  @Field({ nullable: true })
  public country!: string

  @Field({ nullable: true })
  public street!: string

  @Field({ nullable: true })
  public cep!: string

  @Field({ nullable: true })
  public city!: string

  @Field({ nullable: true })
  public state!: string
}

export default AddressInput
