import ReportService from '../../server/services/ticket/report/ReportService';
import Status from '../../server/models/ticket/Status';
import { TicketTimeField } from '~/server/services/ticket/report/ReportService';

describe('Report', () => {
  it('Return grouped by status', async () => {
    await ReportService.reportGrouped({}, 'status');
  });

  it('Return grouped by openedBy', async () => {
    await ReportService.reportGrouped({}, 'openedBy');
  });

  it('Should return filtered report by status', async () => {
    const status = await Status.findOne();
    await ReportService.reportGrouped({ status: { id: 16 } }, 'status');
  });

  it('Should return report by date', async () => {
    await ReportService.reportByDate(
      TicketTimeField.created,
      new Date(),
      new Date(),
    );
  });
});
