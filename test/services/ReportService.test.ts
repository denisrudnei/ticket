import ReportService, {
  TicketTimeField
} from '../../server/services/ticket/ReportService'
import Status from '../../server/models/ticket/Status'

describe('Report', function() {
  it('Return grouped by status', async () => {
    await ReportService.reportGrouped({}, 'status')
  })

  it('Return grouped by openedBy', async () => {
    await ReportService.reportGrouped({}, 'openedBy')
  })

  it('Should return filtered report by status', async () => {
    const status = await Status.findOne()
    await ReportService.reportGrouped({ status: { id: 16 } }, 'status')
  })

  it('Should return report by date', async () => {
    await ReportService.reportByDate(
      TicketTimeField.created,
      new Date(),
      new Date()
    )
  })
})
