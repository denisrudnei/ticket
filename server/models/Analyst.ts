/* eslint-disable no-shadow */
import bcrypt from 'bcryptjs';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import AnalystStatus from '../enums/AnalystStatus';
import Address from './Address';
import Chat from './chat/Chat';
import Notification from './Notification';
import Path from './Path';
import Role from './Role';
import Sound from './Sound';
import Group from './ticket/Group';
import Ticket from './ticket/Ticket';

@Entity()
@ObjectType()
class Analyst extends BaseEntity {
  constructor(analyst?: Partial<Analyst>) {
    super();
    Object.assign(this, analyst);
  }

  @PrimaryGeneratedColumn()
  @Field(() => ID)
  public id!: number;

  @Column({ unique: true })
  @Field()
  public email!: string;

  @Column()
  @Field(() => AnalystStatus)
  public status: AnalystStatus = AnalystStatus.OFFLINE;

  @Column()
  @Field()
  public lastTimeActive: Date = new Date();

  @Column({ nullable: false })
  @Field()
  public contactEmail: string = '';

  @Column({ nullable: false })
  @Field()
  public name!: string;

  @ManyToOne(() => Role, { nullable: false })
  @Field(() => Role)
  public role!: Role;

  @Column()
  public password!: string;

  private tempPassword!: string;

  @ManyToOne(() => Address)
  @Field(() => Address, { nullable: true })
  public address: Address | null = null;

  @Column()
  @Field()
  public description: string = '';

  @Column()
  @Field()
  public active: boolean = false;

  @Column()
  @Field()
  public picture: string = '/user.svg';

  @Column()
  @Field()
  public color: string = '#673ab7';

  @Column()
  @Field()
  public mergePictureWithExternalAccount: boolean = false;

  @OneToMany(() => Sound, (Sound) => Sound.analyst)
  @Field(() => [Sound])
  public sounds!: Sound[];

  @ManyToMany(() => Group, (Group) => Group.analysts)
  @Field(() => [Group])
  public groups!: Group[];

  @ManyToMany(() => Chat, (Chat) => Chat.participants)
  @Field(() => [Chat])
  public chats!: Chat[];

  @OneToMany(() => Ticket, (Ticket) => Ticket.actualUser)
  @Field(() => [Ticket])
  public ticketsActualUser!: Ticket[];

  @OneToMany(() => Path, (Path) => Path.user)
  @Field(() => [Path])
  public paths!: Path[];

  @ManyToMany(() => Notification, (Notification) => Notification.read)
  @Field(() => [Notification])
  public notificationsRead!: Notification[];

  @ManyToMany(() => Notification, (Notification) => Notification.to)
  @Field(() => [Notification])
  public notificationsToMe!: Notification[];

  public async getGroups(): Promise<Group[]> {
    const { groups } = (await Analyst.findOne(this.id, { relations: ['groups'] }) as Analyst);
    return groups;
  }

  @AfterLoad()
  checkPasswordChanged() {
    this.tempPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    if (this.password && this.password !== this.tempPassword) {
      const salt = bcrypt.genSaltSync(12);
      this.password = bcrypt.hashSync(this.password, salt);
    }
    this.tempPassword = '';
  }

  public verifyPassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }
}

export default Analyst;
