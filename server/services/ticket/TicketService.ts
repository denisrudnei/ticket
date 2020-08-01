import '~/server/models/Notification';

import Agenda from 'agenda';
import { PubSubEngine } from 'apollo-server-express';
import AWS from 'aws-sdk';
import { UploadedFile } from 'express-fileupload';
import S3 from '~/plugins/S3';
import Analyst from '~/server/models/Analyst';
import File from '~/server/models/File';
import Comment from '~/server/models/ticket/Comment';
import Group from '~/server/models/ticket/Group';
import Status from '~/server/models/ticket/Status';
import Ticket from '~/server/models/ticket/Ticket';

class TicketService {
  static async startAgenda(pubSub: PubSubEngine): Promise<void> {
    const agenda = new Agenda({
      db: {
        address: process.env.MONGODB_URI,
      },
    });
    await agenda.start();
    agenda.define('check sla', async () => {
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

    agenda.every('5 seconds', 'check sla');
  }

  static getTickets(
    filter: any,
    sortBy: any,
    page: number,
    limit: number,
  ): Promise<Ticket[]> {
    // TODO sorting not works with doc ref
    return new Promise((resolve, reject) => {
      Ticket.find({}).then((tickets) => {
        resolve(tickets);
      });
    });
  }

  static getOne(ticketId: Ticket['id']): Promise<Ticket> {
    return new Promise((resolve, reject) => {
      Ticket.findOne(ticketId).then((ticket) => {
        resolve(ticket);
      });
    });
  }

  static copyTicket(ticketId: Ticket['id'], userId: Analyst['id']): Promise<Ticket> {
    return new Promise((resolve, reject) => {
      Ticket.findOne(ticketId).then(async (ticket) => {
        const analyst = await Analyst.findOne(userId);
        const newTicket = Ticket.create(ticket!);
        newTicket.openedBy = analyst!;
        newTicket.actualUser = analyst!;
        resolve(TicketService.create(newTicket));
      });
    });
  }

  static updateOne(ticketId: Ticket['id'], ticketBody: Ticket): Promise<Ticket> {
    return new Promise((resolve, reject) => {
      Ticket.findOne(ticketId).then((ticket) => {
        Object.assign(ticket, ticketBody);
        ticket!.save().then(() => {
          resolve(TicketService.getOne(ticketId));
        });
      });
    });
  }

  static create(ticket: Ticket): Promise<Ticket> {
    return new Promise((resolve, reject) => {
      resolve(ticket.save());
    });
  }

  static changeStatus(
    ticketId: Ticket['id'],
    statusId: Status['id'],
  ): Promise<Ticket> {
    return new Promise((resolve, reject) => {
      Ticket.findOne(ticketId).then(async (ticket) => {
        const status = await Status.findOne(statusId);
        ticket!.status = status!;
        ticket!.save().then(() => {
          resolve(ticket);
        });
      });
    });
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

  static transferToGroup(
    ticketId: Ticket['id'],
    groupId: Group['id'],
  ): Promise<Ticket> {
    return new Promise((resolve, reject) => {
      Ticket.findOne(ticketId).then(async (ticket) => {
        const group = await Group.findOne(groupId);
        ticket!.group = group!;
        ticket!.actualUser = null;
        ticket!.save().then((ticketSaved) => {
          resolve(ticketSaved);
        });
      });
    });
  }

  static commentOnTicket(
    ticketId: Ticket['id'],
    userId: Analyst['id'],
    content: string,
  ): Promise<Comment> {
    return new Promise((resolve, reject) => {
      Ticket.findOne(ticketId, {
        relations: ['comments'],
      }).then(async (ticket) => {
        const user = await Analyst.findOne(userId);
        Comment.create({
          user,
          content,
        })
          .save()
          .then((comment: Comment) => {
            ticket!.comments.push(comment);
            ticket!.save().then(() => {
              resolve(comment);
            });
          });
      });
    });
  }

  static removeChildren(
    ticketId: Ticket['id'],
    children: Ticket['id'],
  ): Promise<Ticket> {
    return new Promise((resolve, reject) => {
      Ticket.findOne(ticketId, {
        relations: ['children'],
      }).then((ticket) => {
        ticket!.children = ticket!.children.filter((child) => child.id !== children);
        ticket!.save().then(() => resolve(TicketService.getOne(ticketId)));
      });
    });
  }

  static async addChildren(ticketId: Ticket['id'], children: Ticket[]): Promise<Ticket> {
    if (children.map((child) => child.id).includes(ticketId)) throw new Error('Circular reference detected');
    const ticket = await Ticket.findOne(ticketId, {
      relations: ['children'],
    });
    ticket!.children.push(...children);
    return ticket!.save();
  }

  static insertFile(ticketId: Ticket['id'], files: UploadedFile[]): Promise<File[]> {
    return new Promise((resolve, reject) => {
      Ticket.findOne(ticketId, {
        relations: ['files'],
      }).then(async (ticket) => {
        files.forEach(async (f, index) => {
          const name = `ticket/${ticketId}/${f.name} - ${index}`;
          const params = {
            Bucket: process.env.BUCKET!,
            Key: name,
            Body: f.data,
          };
          const { Location } = await S3.upload(params).promise();
          const file = File.create();
          file.name = name;
          file.type = f.mimetype;
          file.url = Location!;
          await file.save();
          ticket!.files.push(file);
          await ticket!.save();
          resolve(ticket!.files);
        });
      });
    });
  }

  static getFile(fileId: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      S3.getObject(
        {
          Bucket: process.env.BUCKET!,
          Key: fileId,
        },
        (err: Error, file: AWS.S3.Types.GetObjectOutput) => {
          if (err) reject(err);
          return resolve(file.Body as Buffer);
        },
      );
    });
  }

  static async removeFile(
    ticketId: Ticket['id'],
    fileId: File['id'],
  ): Promise<Ticket> {
    const ticket = await Ticket.findOne(ticketId, {
      relations: ['files'],
    });
    await S3.deleteObject({
      Bucket: process.env.BUCKET!,
      Key: fileId.toString(),
    });
    ticket!.files = ticket!.files.filter((f: any) => f.name !== fileId);
    ticket!.save();
    return ticket!;
  }

  static overtakeSla(ticketId: Ticket['id']): Promise<boolean> {
    return new Promise((resolve, reject) => {
      Ticket.findOne(ticketId).then((ticket) => {
        resolve(ticket!.overtakeSla);
      });
    });
  }

  static slaPercentage(ticketId: Ticket['id']): Promise<Number> {
    return new Promise((resolve, reject) => {
      Ticket.findOne(ticketId).then((ticket) => {
        resolve(ticket!.slaPercentage);
      });
    });
  }
}

export default TicketService;
