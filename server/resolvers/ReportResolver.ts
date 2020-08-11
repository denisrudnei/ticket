/* eslint-disable class-methods-use-this */
import {
  Arg, Authorized, Query, Resolver,
} from 'type-graphql';

import ReportAttributes from '../inputs/ReportAttributes';
import Ticket from '../models/ticket/Ticket';
import GroupedResult from '../services/ticket/report/GroupedResult';
import ReportByDate from '../services/ticket/report/ReportByDate';
import ReportService, { TicketTimeField } from '../services/ticket/report/ReportService';

@Resolver()
class ReportResolver {
  @Query(() => [GroupedResult])
  @Authorized('user')
  TicketReport(
    @Arg('attributes', () => ReportAttributes) attributes: Ticket,
    @Arg('field') field: TicketTimeField,
  ): Promise<GroupedResult[]> {
    return ReportService.reportGrouped(attributes, field);
  }

  @Query(() => [ReportByDate])
  @Authorized('user')
  ReportByDate(
    @Arg('field') field: TicketTimeField,
    @Arg('start', () => Date, { nullable: true }) start: Date,
    @Arg('end', { nullable: true }) end: Date,
  ): Promise<ReportByDate[]> {
    return ReportService.reportByDate(field, start, end);
  }
}

export default ReportResolver;
