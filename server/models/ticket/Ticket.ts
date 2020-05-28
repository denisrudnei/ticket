import { differenceInMinutes, format } from 'date-fns'
import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

import Address from '../Address'
import Analyst from '../Analyst'
import File from '../File'
import Category from './Category'
import Comment from './Comment'
import Group from './Group'
import Log from './Log'
import Priority from './Priority'
import Status from './Status'

@Entity()
@ObjectType()
class Ticket extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  public id!: number

  @Column({ nullable: false })
  @Field(type => String)
  public resume!: string

  @Column({ nullable: false })
  @Field(type => String)
  public content!: string

  @Field(type => Category)
  @ManyToOne(type => Category, { eager: true, nullable: false })
  public category!: Category

  @ManyToOne(type => Group, { eager: true, nullable: false })
  @Field(type => Group)
  public group!: Group

  @ManyToOne(type => Address, { eager: true, nullable: false })
  @Field(type => Address)
  public address!: Address

  @ManyToOne(type => Status, { eager: true, nullable: false })
  @Field(type => Status)
  public status!: Status

  @OneToMany(type => Comment, Comment => Comment.ticket)
  @Field(type => Comment)
  public comments!: Comment[]

  @ManyToOne(type => Analyst, { eager: true, nullable: false })
  @Field(type => Analyst)
  public affectedUser!: Analyst

  @ManyToOne(type => Analyst, { eager: true, nullable: false })
  @Field(type => Analyst)
  public openedBy!: Analyst

  @ManyToOne(type => Analyst, { eager: true, nullable: false })
  @Field(type => Analyst)
  public actualUser!: Analyst

  @ManyToOne(type => Priority, { eager: true, nullable: false })
  @Field(type => Priority)
  public priority!: Priority

  @OneToOne(type => Ticket, Ticket => Ticket.children)
  @JoinColumn({ name: 'father' })
  @Field(type => Ticket)
  public father!: Ticket

  @OneToMany(type => Ticket, Ticket => Ticket.father)
  @Field(type => [Ticket])
  public children!: Ticket[]

  @OneToMany(type => File, File => File.ticket)
  @Field(type => [File])
  public files!: File[]

  @OneToMany(type => Log, Log => Log.ticket)
  @Field(type => [Log])
  public logs!: Log[]

  @Column()
  @Field()
  public slaCount: Date = new Date()

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  public created: Date = new Date()

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  public modified: Date = new Date()

  @Field()
  public get overtakeSla(): boolean {
    if (!this.category.sla) return false
    const slaBase = new Date('1970/01/01 00:00:00')
    const slaLimit = new Date(
      `1970/01/01 ${format(this.category.sla.limit, 'HH:mm:ss')}`
    )
    return (
      Math.abs(
        differenceInMinutes(new Date(this.created), new Date(this.slaCount))
      ) > Math.abs(differenceInMinutes(slaBase, slaLimit))
    )
  }

  @Field()
  public get slaPercentage(): Number {
    if (!this.category!.sla) return 0
    const slaBase = new Date('1970/01/01 00:00:00')
    const slaLimit = new Date(
      `1970/01/01 ${format(new Date(this.category!.sla.limit), 'HH:mm:ss')}`
    )
    const base = Math.abs(differenceInMinutes(slaBase, slaLimit)) / 100
    const elapsed = Math.abs(
      differenceInMinutes(new Date(this.created), new Date(this.slaCount))
    )
    if (base === 0 || elapsed === 0) return 0
    return elapsed / base
  }
}

export default Ticket
