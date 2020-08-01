import StatusService from '../../server/services/ticket/StatusService';
import Status from '../../server/models/ticket/Status';

describe('Status', () => {
  it('Get status', async () => {
    await StatusService.getStatus();
  });

  it('Create new status', async () => {
    const status = new Status();
    status.name = 'test';
    status.description = 'description';

    await StatusService.create(status);
  });

  it('Get one status', async () => {
    const status = await Status.findOne();
    await StatusService.getOne(status!.id);
  });

  it('Should return allowed status', async () => {
    const status1 = new Status();
    status1.name = 'status 1';
    status1.description = 'description';
    status1.slaRun = false;

    const status2 = new Status();
    status2.name = 'status 2';
    status2.description = 'description';
    status2.slaRun = false;
    status2.allowedStatus = [status1];

    await Status.create(status1);
    await Status.create(status2);
    await StatusService.getAllowedStatus(status2.id);
  });

  it('Edit status', async () => {
    const status = await Status.findOne();
    const status2 = (await Status.find())[1];
    status!.allowedStatus = [status2];
    status!.name = 'updated name';
    await StatusService.edit(status!.id, status!);
  });
});
