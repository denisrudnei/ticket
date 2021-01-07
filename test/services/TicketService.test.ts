import faker from 'faker';
import { UploadedFile } from 'express-fileupload';
import Ticket from '../../server/models/ticket/Ticket';
import TicketService from '../../server/services/ticket/TicketService';
import Group from '../../server/models/ticket/Group';
import Status from '../../server/models/ticket/Status';
import Analyst from '../../server/models/Analyst';
import Category from '../../server/models/ticket/Category';
import Address from '~/server/models/Address';
import Priority from '~/server/models/ticket/Priority';
import { transformToSort } from '~/server/utils/sortUtils';

let idWithFile = 0;

describe('Ticket', () => {
  it('Create new ticket', async () => {
    const status = await Status.findOne();
    const group = await Group.findOne();
    const category = await Category.findOne();
    const openedBy = await Analyst.findOne();
    const actualUser = await Analyst.findOne();
    const priority = await Priority.findOne();
    const address = await Address.findOne();
    const newTicket = new Ticket();
    newTicket.status = status!;
    newTicket.group = group!;
    newTicket.category = category!;
    newTicket.openedBy = openedBy!;
    newTicket.actualUser = actualUser!;
    newTicket.affectedUser = actualUser!;
    newTicket.address = address!;
    newTicket.priority = priority!;
    newTicket.content = 'Content';
    newTicket.resume = 'Resume';

    TicketService.create(newTicket);
  });

  it('Copy a ticket', async () => {
    const user = await Analyst.findOne();
    const ticket = await Ticket.findOne();
    await TicketService.copyTicket(ticket!.id, user!.id);
  });

  it('Get All tickets', async () => {
    const sort = {
      sortBy: ['category'],
      descending: -1,
    };
    await TicketService.getTickets({}, transformToSort(sort.sortBy, sort.descending), 1, 10);
  });

  it('Get one ticket by id', async () => {
    const ticket = await Ticket.findOne();
    await TicketService.getOne(ticket!.id);
  });

  it('Edit one ticket', async () => {
    const ticket = await Ticket.findOne();
    ticket!.content = faker.lorem.paragraphs();
    return TicketService.updateOne(ticket!.id, ticket!);
  });

  it('Transfer to group', async () => {
    const group = await Group.findOne();
    const ticket = await Ticket.findOne();
    await TicketService.transferToGroup(ticket!.id, group!.id);
  });

  it('Change status', async () => {
    const status = await Status.findOne();
    const ticket = await Ticket.findOne();
    await TicketService.changeStatus(ticket!.id, status!.id);
  });

  it('Add comment in ticket', async () => {
    const analyst = await Analyst.findOne();
    const ticket = await Ticket.findOne();
    const content = faker.lorem.paragraphs();
    await TicketService.commentOnTicket(ticket!.id, analyst!.id, content);
  });

  it('Add file', async () => {
    const ticket = await Ticket.findOne();
    idWithFile = ticket!.id!;
    const files: UploadedFile[] = [
      {
        name: 'testFile.txt',
        data: Buffer.from(''),
        mimetype: 'text/*',
      } as UploadedFile,
    ];

    await TicketService.insertFile(ticket!.id, files);
  });

  it('Get file', async () => {
    const ticket = await Ticket.findOne(idWithFile, { relations: ['files'] });
    await TicketService.getFile(ticket!.files[0].id);
  });

  it('Delete file', async () => {
    const ticket = await Ticket.findOne(idWithFile, { relations: ['files'] });
    await TicketService.removeFile(ticket!.id, ticket!.files[0].id);
  });

  it('Add children', async () => {
    const tickets: Ticket[] = await Ticket.find();
    const first = tickets[0];
    const second = tickets[1];

    await TicketService.addChildren(first.id, [second]);
  });

  it('Circular reference', async () => {
    const tickets: Ticket[] = await Ticket.find();
    const first = tickets[0];

    try {
      await TicketService.addChildren(first.id, [first]);
    } catch {
      console.log('Circular reference');
    }
  });

  it('Should change status of tickets', async () => {
    const tickets: Ticket[] = await Ticket.find();
    const status = await Status.findOne();
    await TicketService.changeStatusOfTickets(
      tickets.map((ticket) => ticket.id),
      status!.id,
    );
  });

  it('Should change group of tickets', async () => {
    const tickets: Ticket[] = await Ticket.find();
    const group = await Group.findOne();
    await TicketService.transferTickets(
      tickets.map((ticket) => ticket.id),
      group!.id,
    );
  });

  it('Should return overtake sla', async () => {
    const ticket = await Ticket.findOne();
    await TicketService.overtakeSla(ticket!.id);
  });

  it('Should return sla in percentage', async () => {
    const ticket = await Ticket.findOne();
    await TicketService.slaPercentage(ticket!.id);
  });

  it('Remove children', async () => {
    const tickets = await Ticket.find();
    const first = tickets[0];
    const second = tickets[1];

    await TicketService.removeChildren(first.id, second.id);
  });
});
