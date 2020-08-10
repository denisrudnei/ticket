import lodash from 'lodash';
import Path from '../../models/Path';
import Analyst from '../../models/Analyst';
import Ticket from '../../models/ticket/Ticket';
import Address from '../../models/Address';
import PathTree from './PathTree';
import Info from './Info';
import ProfileInfo from './ProfileInfo';
import Ref from './Ref';
import Category from '~/server/models/ticket/Category';
import Group from '~/server/models/ticket/Group';
import Status from '~/server/models/ticket/Status';
import Priority from '~/server/models/ticket/Priority';

enum TicketObjects {
  'category' = 'category',
  'group' = 'group',
  'address' = 'address',
  'status' = 'status',
  'affectedUser' = 'affectedUser',
  'openedBy' = 'openedBy',
  'actualUser' = 'actualUser',
  'priority' = 'priority',
}

class PathService {
  static async create(pathToCreate: Path, userId: Analyst['id']): Promise<PathTree> {
    const path = Path.create();
    path.name = pathToCreate.name;
    path.objectName = pathToCreate.objectName;
    path.property = pathToCreate.property;
    const savedPath = await path.save();

    const analyst = await Analyst.findOne(userId, { relations: ['paths'] });
    if (!analyst) throw new Error('Analyst not found');
    analyst.paths.push(savedPath);
    await analyst.save();
    return PathService.getOnePathTree(savedPath.id);
  }

  static async getProfileInfo(userId: Analyst['id']): Promise<ProfileInfo> {
    const tickets = await Ticket.find({});
    const opened = tickets.filter((t) => t.openedBy.id === userId).length;
    const total = tickets.length;
    const groupedByCategory = lodash.groupBy(tickets, 'category.name');
    const categories = Object.keys(groupedByCategory)
      .map((name) => new Info(name, groupedByCategory[name].length));
    const groupedByStatus = lodash.groupBy(tickets, 'status.name');
    const status = Object.keys(groupedByStatus)
      .map((name) => new Info(name, groupedByStatus[name].length));
    const groupedByInName = lodash.groupBy(tickets, 'actualUser.name');
    const inName = Object.keys(groupedByInName)
      .map((name) => new Info(name, groupedByInName[name].length));
    // .filter(v => {
    //   return v.name === userId
    // })[0]
    return new ProfileInfo(opened, total, categories, status, inName);
  }

  static async getAddress(userId: Analyst['id']): Promise<Address | null> {
    const { address } = (await Analyst.findOne(userId, { relations: ['address'] }) as Analyst);
    return address;
  }

  static async getRefs(): Promise<Ref[]> {
    const ticket = await PathService.createFullyTicket();
    const result = Object.values(TicketObjects)
      .map((property) => new Ref(property, this.getOptions(ticket![property])));
    return result;
  }

  static async getPaths(userId: Analyst['id']) {
    const { paths } = (await Analyst.findOne(userId, { relations: ['paths'] }) as Analyst);
    return paths;
  }

  static async getOnePathTree(pathId: Path['id']): Promise<PathTree> {
    // FIXME
    function getId(object: any, property: string) {
      return object.map((value: any) => value[property].id)[0];
    }
    const path = await Path.findOne(pathId);
    const tickets = await Ticket.find();
    const base = lodash.groupBy(
      tickets,
      `${path!.objectName}.${path!.property}`,
    );
    const children = Object.keys(base)
      .filter((value) => value !== 'undefined')
      .map((k) => new PathTree(
        `(${base[k].length}) ${k}`,
        `/search?${path!.objectName}=${getId(base[k], path!.objectName)}`,
        [],
      ));
    return new PathTree(path!.name, '', children);
  }

  static async getPathsTree(userId: Analyst['id']): Promise<PathTree[]> {
    const user = await Analyst.findOne(userId, { relations: ['paths'] });
    if (!user) throw new Error('Analyst not found');
    const response: Promise<PathTree>[] = user!.paths.map(
      (path: Path) => this.getOnePathTree(path.id),
    );
    const results = await Promise.all(response);
    const result = results.filter((value) => value.children.length > 0);
    return result;
  }

  static async remove(userId: Analyst['id'], pathId: Path['id']): Promise<Path> {
    const analyst = await Analyst.findOne(userId, { relations: ['paths'] });
    if (!analyst) throw new Error('Analyst not found');
    analyst.paths = analyst!.paths.filter((path) => path.id !== pathId);
    await analyst.save();
    const path = await Path.findOne(pathId);
    if (!path) throw new Error('Path not found');
    await Path.delete(pathId);
    return path;
  }

  static createFullyTicket(): Ticket {
    const analyst = new Analyst({
      name: '',
    });

    const address = new Address({
      name: '',
      state: '',
      street: '',
      cep: '',
      city: '',
      country: '',
    });

    const group = new Group({
      name: '',
      description: '',
    });

    const status = new Status({
      name: '',
      description: '',
    });

    const priority = new Priority({
      name: '',
    });

    const category = new Category({
      name: '',
      description: '',
    });

    const ticket = new Ticket({
      actualUser: analyst,
      affectedUser: analyst,
      openedBy: analyst,
      address,
      group,
      status,
      priority,
      category,
    });
    return ticket;
  }

  static getOptions(ref: any): string[] {
    const hiddenFields = ['email', 'password', 'tempPassword'];
    return Object.getOwnPropertyNames(ref)
      .filter((property) => typeof ref[property] === 'string')
      .filter((name) => !hiddenFields.includes(name));
  }
}

export default PathService;
