import { IResolvers } from 'graphql-tools'
import ReportService from '../services/ticket/ReportService'

const ReportResolver: IResolvers = {
  Query: {
    TicketReport: (_, { attributes, field, ref }) => {
      return ReportService.reportGrouped(attributes, field, ref)
    },
    ReportByDate: (_, { field, start, end }) => {
      return ReportService.reportByDate(field, start, end)
    }
  }
}

export default ReportResolver
