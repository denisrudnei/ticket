import bcrypt from 'bcryptjs'
import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  BeforeUpdate,
  AfterLoad
} from 'typeorm'

import Address from './Address'
import Chat from './chat/Chat'
import Notification from './Notification'
import Path from './Path'
import Sound from './Sound'
import Group from './ticket/Group'
import Ticket from './ticket/Ticket'

@Entity()
@ObjectType()
class Analyst extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  public id!: number

  @Column({ unique: true })
  @Field()
  public email!: string

  @Column()
  @Field()
  public status: string = 'offline'

  @Column()
  @Field()
  public lastTimeActive: Date = new Date()

  @Column({ nullable: false })
  @Field()
  public contactEmail: string = ''

  @Column({ nullable: false })
  @Field()
  public name!: string

  @Column()
  @Field()
  public role: string = 'user'

  @Column()
  public password!: string

  private tempPassword!: string

  @ManyToOne(type => Address)
  @Field(type => Address, { nullable: true })
  public address: Address | null = null

  @Column()
  @Field()
  public description: string = ''

  @Column()
  @Field()
  public active: boolean = false

  @Column()
  @Field()
  public picture: string = '/user.svg'

  @Column()
  @Field()
  public color: string = '#673ab7'

  @Column()
  @Field()
  public mergePictureWithExternalAccount: boolean = false

  @OneToMany(type => Sound, Sound => Sound.analyst)
  @Field(type => [Sound])
  public sounds!: Sound[]

  @ManyToMany(type => Group, Group => Group.analysts)
  @Field(type => [Group])
  public groups!: Group[]

  @ManyToMany(type => Chat, Chat => Chat.participants)
  @Field(type => [Chat])
  public chats!: Chat[]

  @OneToMany(type => Ticket, Ticket => Ticket.actualUser)
  @Field(type => [Ticket])
  public ticketsActualUser!: Ticket[]

  @OneToMany(type => Path, Path => Path.user)
  @Field(type => [Path])
  public paths!: Path[]

  @ManyToMany(type => Notification, Notification => Notification.read)
  @Field(type => [Notification])
  public notificationsRead!: Notification[]

  @ManyToMany(type => Notification, Notification => Notification.to)
  @Field(type => [Notification])
  public notificationsToMe!: Notification[]

  public getGroups(): Promise<Group[]> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(this.id, { relations: ['groups'] }).then(analyst => {
        resolve(analyst!.groups)
      })
    })
  }

  @AfterLoad()
  checkPasswordChanged() {
    this.tempPassword = this.password
  }

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    if (this.password && this.password !== this.tempPassword) {
      const salt = bcrypt.genSaltSync(12)
      this.password = bcrypt.hashSync(this.password, salt)
    }
    this.tempPassword = ''
  }

  public verifyPassword(password: string) {
    return bcrypt.compareSync(password, this.password)
  }
}

export default Analyst
