import ReportService from '../../server/services/ticket/ReportService'

describe('Report', function() {
  this.timeout(0)

  it('Return grouped by status', async () => {
    await ReportService.reportGrouped({}, 'status', 'status')
  })

  it('Return grouped by openedBy', async () => {
    await ReportService.reportGrouped({}, 'openedBy', 'analysts')
  })

  it('Reject', async () => {
    try {
      await ReportService.reportGrouped({}, 'actual', 'analysts')
    } catch {}
  })
})
