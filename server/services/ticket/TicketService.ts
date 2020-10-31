import '~/server/models/Notification';

import { PubSubEngine } from 'apollo-server-express';
import AWS from 'aws-sdk';
import Bull from 'bull';
import { UploadedFile } from 'express-fileupload';
import S3 from '~/plugins/S3';
import TicketAttributes from '~/server/inputs/TicketAttributes';
import Analyst from '~/server/models/Analyst';
import File from '~/server/models/File';
import Comment from '~/server/models/ticket/Comment';
import Group from '~/server/models/ticket/Group';
import Status from '~/server/models/ticket/Status';
import Ticket from '~/server/models/ticket/Ticket';

type sortOrder = {
  sortBy: string;
  descending: number;
};

class TicketService {
  static async startBull(pubSub: PubSubEngine): Promise<void> {
    const queue = new Bull<null>('sla check', process.env.REDIS_URL || 'redis://127.0.0.1:6379');
    queue.process(async () => {
      const statusWithSlaAbleToRun = await Status.find({
        slaRun: true,
      });

      Ticket.createQueryBuilder()
        .update(Ticket)
        .set({
          slaCount: new Date(),
        })
        .where('status.id IN :ids', {
          ids: statusWithSlaAbleToRun.map((status: Status) => status.id),
        });

      // const tickets = await Ticket.createQueryBuilder()
      //   .where('status.id IN :ids', {
      //     ids: statusWithSlaAbleToRun.map((status: Status) => status.id)
      //   })
      //   .getMany()

      // tickets.forEach(ticket => {
      //   pubSub.publish(TicketEnum.SLA_UPDATE, ticket)
      // })
    });

    queue.add(null, {
      repeat: {
        cron: '* * * * *',
      },
    });
  }

  static async getTickets(
    filter: Partial<TicketAttributes>,
    sortInfo: sortOrder,
    page: number,
    limit: number,
  ): Promise<Ticket[]> {
    return Ticket.find({
      take: limit,
      skip: (page === 0 ? 1 : page - 1) * limit,
      where: filter,
      order: {
        [sortInfo.sortBy]: sortInfo.descending,
      },
    });
  }

  static async getOne(ticketId: Ticket['id']): Promise<Ticket> {
    const ticket = await Ticket.findOne(ticketId);
    if (!ticket) throw new Error('Ticket not found');
    return ticket;
  }

  static async copyTicket(ticketId: Ticket['id'], userId: Analyst['id']): Promise<Ticket> {
    const ticket = await Ticket.findOne(ticketId);
    if (!ticket) throw new Error('Ticket not found');
    const analyst = await Analyst.findOne(userId);
    delete ticket.id;
    const newTicket = Ticket.create(ticket);
    if (!analyst) throw new Error('Analyst not found');
    newTicket.openedBy = analyst;
    newTicket.actualUser = analyst;
    return TicketService.create(newTicket);
  }

  static async updateOne(ticketId: Ticket['id'], ticketBody: Ticket): Promise<Ticket> {
    const ticket = await Ticket.findOne(ticketId);
    if (!ticket) throw new Error('Ticket not found');
    Object.assign(ticket, ticketBody);
    await ticket.save();
    return TicketService.getOne(ticketId);
  }

  static async create(ticket: Ticket): Promise<Ticket> {
    return ticket.save();
  }

  static async changeStatus(
    ticketId: Ticket['id'],
    statusId: Status['id'],
  ): Promise<Ticket> {
    const ticket = await Ticket.findOne(ticketId);
    const status = await Status.findOne(statusId);
    if (!ticket) throw new Error('Ticket not found');
    if (!status) throw new Error('Status not found');
    ticket.status = status;
    const savedTicket = await ticket.save();
    return savedTicket;
  }

  static changeStatusOfTickets(
    tickets: Ticket['id'][],
    statusId: Status['id'],
  ): Promise<Ticket[]> {
    const promises = tickets.map((ticketId) => TicketService.changeStatus(ticketId, statusId));
    return Promise.all(promises);
  }

  static transferTickets(
    tickets: Ticket['id'][],
    groupId: Group['id'],
  ): Promise<Ticket[]> {
    const promises = tickets.map((ticketId) => TicketService.transferToGroup(ticketId, groupId));
    return Promise.all(promises);
  }

  static async transferToGroup(
    ticketId: Ticket['id'],
    groupId: Group['id'],
  ): Promise<Ticket> {
    const ticket = await Ticket.findOne(ticketId);
    const group = await Group.findOne(groupId);
    if (!ticket) throw new Error('Ticket not found');
    if (!group) throw new Error('Group not found');
    ticket.group = group;
    ticket.actualUser = null;
    const ticketSaved = await ticket.save();
    return ticketSaved;
  }

  static async commentOnTicket(
    ticketId: Ticket['id'],
    userId: Analyst['id'],
    content: string,
  ): Promise<Comment> {
    const ticket = await Ticket.findOne(ticketId, {
      relations: ['comments'],
    });
    if (!ticket) throw new Error('Ticket not found');
    const user = await Analyst.findOne(userId);
    const comment = await Comment.create({
      user,
      content,
    }).save();

    ticket.comments.push(comment);
    await ticket.save();
    return comment;
  }

  static async removeChildren(
    ticketId: Ticket['id'],
    children: Ticket['id'],
  ): Promise<Ticket> {
    const ticket = await Ticket.findOne(ticketId, {
      relations: ['children'],
    });
    if (!ticket) throw new Error('Ticket not found');
    ticket.children = ticket.children.filter((child) => child.id !== children);
    await ticket.save();
    return TicketService.getOne(ticketId);
  }

  static async addChildren(ticketId: Ticket['id'], children: Ticket[]): Promise<Ticket> {
    if (children.map((child) => child.id).includes(ticketId)) throw new Error('Circular reference detected');
    const ticket = await Ticket.findOne(ticketId, {
      relations: ['children'],
    });
    if (!ticket) throw new Error('Ticket not found');
    ticket.children.push(...children);
    return ticket.save();
  }

  static async insertFile(ticketId: Ticket['id'], files: UploadedFile[]): Promise<File[]> {
    const ticket = await Ticket.findOne(ticketId, {
      relations: ['files'],
    });
    if (!ticket) throw new Error('Ticket not found');
    const result = await Promise.all(files.map(async (f, index) => {
      const name = `ticket/${ticketId}/${f.name} - ${index}`;
      const params = {
        Bucket: process.env.BUCKET!,
        Key: name,
        Body: f.data,
        ContentType: f.mimetype,
        ACL: 'public-read',
      };
      const { Location } = await S3.upload(params).promise();
      const file = File.create();
      file.name = name;
      file.type = f.mimetype;
      file.url = Location;
      return file.save();
    }));
    ticket.files = result;
    await ticket.save();
    return ticket.files;
  }

  static async getFile(fileId: File['id']): Promise<AWS.S3.Types.Body> {
    const file = await File.findOne(fileId);
    if (!file) throw new Error('File not found');
    const { Body } = await S3.getObject(
      {
        Bucket: process.env.BUCKET!,
        Key: file.name,
      },
    ).promise();
    if (!Body) throw new Error('File not found');
    return Body;
  }

  static async removeFile(
    ticketId: Ticket['id'],
    fileId: File['id'],
  ): Promise<Ticket> {
    const ticket = await Ticket.findOne(ticketId, {
      relations: ['files'],
    });
    const file = await File.findOne(fileId);
    if (!ticket) throw new Error('Ticket not found');
    if (!file) throw new Error('File not found');
    await S3.deleteObject({
      Bucket: process.env.BUCKET!,
      Key: file.name,
    });
    ticket.files = ticket.files.filter((f) => f.name !== file.name);
    await ticket.save();
    return ticket!;
  }

  static async overtakeSla(ticketId: Ticket['id']): Promise<boolean> {
    const ticket = await Ticket.findOne(ticketId);
    if (!ticket) throw new Error('Ticket not found');
    return ticket.overtakeSla;
  }

  static async slaPercentage(ticketId: Ticket['id']): Promise<Number> {
    const ticket = await Ticket.findOne(ticketId);
    if (!ticket) throw new Error('Ticket not found');
    return ticket.slaPercentage;
  }
}

export default TicketService;
