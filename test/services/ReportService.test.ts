import ReportService from '../../server/services/ticket/ReportService'
import Status from '../../server/models/ticket/Status'

describe('Report', function() {
  this.timeout(0)

  it('Return grouped by status', async () => {
    await ReportService.reportGrouped({}, 'status', 'status')
  })

  it('Return grouped by openedBy', async () => {
    await ReportService.reportGrouped({}, 'openedBy', 'analysts')
  })

  it('Should return filtered report by status', async () => {
    const status = await Status.findOne().exec()
    await ReportService.reportGrouped(
      { status: [status._id] },
      'status',
      'status'
    )
  })

  it('Should return report by date', async () => {
    await ReportService.reportByDate('status')
  })
})
