/* eslint-disable import/prefer-default-export */
import Ticket from '../models/ticket/Ticket';

export type sortTicket = {
  [P in keyof Ticket]?: 'ASC' | 'DESC' | 1 | -1
};
