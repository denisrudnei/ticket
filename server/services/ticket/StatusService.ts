import Status from '../../models/ticket/Status';

class StatusService {
  static getStatus(): Promise<Status[]> {
    return new Promise((resolve, reject) => {
      Status.find().then((status: Status[]) => resolve(status));
    });
  }

  static getOne(statusId: Status['id']): Promise<Status> {
    return new Promise((resolve, reject) => {
      Status.findOne(statusId).then((status) => resolve(status));
    });
  }

  static create(status: Status): Promise<Status> {
    return new Promise((resolve, reject) => {
      const newStatus = new Status();
      Object.assign(newStatus, status);
      newStatus.save().then(() => {
        resolve(newStatus);
      });
    });
  }

  static getAllowedStatus(id: Status['id']): Promise<Status[]> {
    return new Promise((resolve, reject) => {
      Status.findOne(id).then((result) => resolve(result!.allowedStatus));
    });
  }

  static edit(statusId: Status['id'], statusToEdit: Status): Promise<Status> {
    return new Promise((resolve, reject) => {
      Status.findOne(statusId).then((status) => {
        status!.name = statusToEdit.name;
        status!.allowedStatus = statusToEdit.allowedStatus;
        status!.slaRun = statusToEdit.slaRun;
        status!.save().then((updated) => {
          resolve(updated);
        });
      });
    });
  }
}

export default StatusService;
