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
  static create(pathToCreate: Path, userId: Analyst['id']): Promise<PathTree> {
    return new Promise((resolve, reject) => {
      const path = Path.create();
      path.name = pathToCreate.name;
      path.objectName = pathToCreate.objectName;
      path.property = pathToCreate.property;
      path.save().then((savedPath: Path) => {
        Analyst.findOne(userId, { relations: ['paths'] }).then((analyst) => {
          analyst!.paths.push(savedPath);
          analyst!.save().then(() => {
            resolve(PathService.getOnePathTree(savedPath.id));
          });
        });
      });
    });
  }

  static getProfileInfo(userId: Analyst['id']): Promise<ProfileInfo> {
    return new Promise((resolve, reject) => {
      Ticket.find({}).then((tickets) => {
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
        return resolve(
          new ProfileInfo(opened, total, categories, status, inName),
        );
      });
    });
  }

  static getAddress(userId: Analyst['id']): Promise<Address | null> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(userId, { relations: ['address'] }).then((analyst) => resolve(analyst!.address));
    });
  }

  static async getRefs(): Promise<Ref[]> {
    const ticket = PathService.createFullyTicket();
    const result = Object.values(TicketObjects)
      .map((property) => new Ref(property, this.getOptions(ticket![property])));
    return result;
  }

  static getPaths(userId: Analyst['id']) {
    return new Promise((resolve, reject) => {
      Analyst.findOne(userId, { relations: ['paths'] }).then((result) => {
        resolve(result!.paths);
      });
    });
  }

  static getOnePathTree(pathId: Path['id']): Promise<PathTree> {
    return new Promise((resolve, reject) => {
      // FIXME
      function getId(object: any, property: string) {
        return object.map((value: any) => value[property].id)[0];
      }
      Path.findOne(pathId).then(async (path) => {
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
        resolve(new PathTree(path!.name, '', children));
      });
    });
  }

  static getPathsTree(userId: Analyst['id']): Promise<PathTree[]> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(userId, { relations: ['paths'] }).then((user) => {
        const response: Promise<PathTree>[] = user!.paths.map(
          (path: Path) => this.getOnePathTree(path.id),
        );
        Promise.all(response).then((results) => {
          const result = results.filter((value) => value.children.length > 0);
          return resolve(result);
        });
      });
    });
  }

  static remove(userId: Analyst['id'], pathId: Path['id']): Promise<Path> {
    return new Promise((resolve, reject) => {
      Analyst.findOne(userId, { relations: ['paths'] }).then((analyst) => {
        analyst!.paths = analyst!.paths.filter((path) => path.id !== pathId);
        analyst!.save().then(async () => {
          const path = await Path.findOne(pathId);
          await Path.delete(pathId);

          resolve(path);
        });
      });
    });
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
