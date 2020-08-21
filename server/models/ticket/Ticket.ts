/* eslint-disable no-shadow */
import { differenceInMinutes, format } from 'date-fns';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn,
} from 'typeorm';

import Address from '../Address';
import Analyst from '../Analyst';
import File from '../File';
import Category from './Category';
import Comment from './Comment';
import Group from './Group';
import Log from './Log';
import Priority from './Priority';
import Status from './Status';
import TicketField from './TicketField';

@Entity()
@ObjectType()
class Ticket extends BaseEntity {
  constructor(ticket?: Partial<Ticket>) {
    super();
    Object.assign(this, ticket);
  }

  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id?: number;

  @Column({ nullable: false })
  @Field(() => String)
  public resume!: string;

  @Column({ nullable: false })
  @Field(() => String)
  public content!: string;

  @Field(() => Category)
  @ManyToOne(() => Category, { eager: true, nullable: false })
  public category!: Category;

  @ManyToOne(() => Group, { eager: true, nullable: false })
  @Field(() => Group)
  public group!: Group;

  @ManyToOne(() => Address, { eager: true, nullable: false })
  @Field(() => Address)
  public address!: Address;

  @ManyToOne(() => Status, { eager: true, nullable: false })
  @Field(() => Status)
  public status!: Status;

  @OneToMany(() => Comment, (Comment) => Comment.ticket)
  @Field(() => [Comment])
  public comments!: Comment[];

  @ManyToOne(() => Analyst, { eager: true, nullable: false })
  @Field(() => Analyst)
  public affectedUser!: Analyst;

  @ManyToOne(() => Analyst, { eager: true, nullable: false })
  @Field(() => Analyst)
  public openedBy!: Analyst;

  @ManyToOne(() => Analyst, { eager: true, nullable: true })
  @Field(() => Analyst, { nullable: true })
  public actualUser?: Analyst | null;

  @ManyToOne(() => Priority, { eager: true, nullable: false })
  @Field(() => Priority)
  public priority!: Priority;

  @OneToOne(() => Ticket, (Ticket) => Ticket.children)
  @JoinColumn({ name: 'father' })
  @Field(() => Ticket)
  public father!: Ticket;

  @OneToMany(() => Ticket, (Ticket) => Ticket.father)
  @Field(() => [Ticket])
  public children!: Ticket[];

  @OneToMany(() => File, (File) => File.ticket)
  @Field(() => [File])
  public files!: File[];

  @OneToMany(() => Log, (Log) => Log.ticket)
  @Field(() => [Log])
  public logs!: Log[];

  @OneToMany(() => TicketField, (TicketField) => TicketField.ticket, { cascade: true })
  @Field(() => [TicketField])
  public fields!: TicketField[];

  @Column()
  @Field()
  public slaCount: Date = new Date();

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  public created: Date = new Date();

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  public modified: Date = new Date();

  @Field()
  public get overtakeSla(): boolean {
    if (!this.category.sla) return false;
    const slaBase = new Date('1970/01/01 00:00:00');
    const slaLimit = new Date(
      `1970/01/01 ${format(this.category.sla.limit, 'HH:mm:ss')}`,
    );
    return (
      Math.abs(
        differenceInMinutes(new Date(this.created), new Date(this.slaCount)),
      ) > Math.abs(differenceInMinutes(slaBase, slaLimit))
    );
  }

  @Field()
  public get slaPercentage(): Number {
    if (!this.category!.sla) return 0;
    const slaBase = new Date('1970/01/01 00:00:00');
    const slaLimit = new Date(
      `1970/01/01 ${format(new Date(this.category!.sla.limit), 'HH:mm:ss')}`,
    );
    const base = Math.abs(differenceInMinutes(slaBase, slaLimit)) / 100;
    const elapsed = Math.abs(
      differenceInMinutes(new Date(this.created), new Date(this.slaCount)),
    );
    if (base === 0 || elapsed === 0) return 0;
    return elapsed / base;
  }
}

export default Ticket;
