import { Resolver, Query, Arg, Authorized } from 'type-graphql'
import ReportService, {
  ReportByDate,
  GroupedResult,
  TicketTimeField
} from '../services/ticket/ReportService'
import Ticket from '../models/ticket/Ticket'
import ReportAttributes from '../inputs/ReportAttributes'

@Resolver()
class ReportResolver {
  @Query(() => [GroupedResult])
  @Authorized('user')
  TicketReport(
    @Arg('attributes', () => ReportAttributes) attributes: Ticket,
    @Arg('field') field: TicketTimeField
  ): Promise<GroupedResult[]> {
    return ReportService.reportGrouped(attributes, field)
  }

  @Query(() => [ReportByDate])
  @Authorized('user')
  ReportByDate(
    @Arg('field') field: TicketTimeField,
    @Arg('start', () => Date, { nullable: true }) start: Date,
    @Arg('end', { nullable: true }) end: Date
  ): Promise<ReportByDate[]> {
    return ReportService.reportByDate(field, start, end)
  }
}

export default ReportResolver
