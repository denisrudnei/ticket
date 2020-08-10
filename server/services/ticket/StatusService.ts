import Status from '../../models/ticket/Status';

class StatusService {
  static async getStatus(): Promise<Status[]> {
    return Status.find();
  }

  static async getOne(statusId: Status['id']): Promise<Status> {
    const status = await Status.findOne(statusId);
    if (!status) throw new Error('Status not found');
    return status;
  }

  static async create(status: Status): Promise<Status> {
    const newStatus = new Status();
    Object.assign(newStatus, status);
    return newStatus.save();
  }

  static async getAllowedStatus(id: Status['id']): Promise<Status[]> {
    const { allowedStatus } = (await Status.findOne(id) as Status);
    return allowedStatus;
  }

  static async edit(statusId: Status['id'], statusToEdit: Status): Promise<Status> {
    const status = await Status.findOne(statusId);
    if (!status) throw new Error('Status not found');
    status.name = statusToEdit.name;
    status.allowedStatus = statusToEdit.allowedStatus;
    status.slaRun = statusToEdit.slaRun;
    const updated = await status!.save();
    return updated;
  }
}

export default StatusService;
