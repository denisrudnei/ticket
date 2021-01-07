/* eslint-disable import/prefer-default-export */
import Ticket from '../models/ticket/Ticket';

type SortTicket = {
  [P in keyof Ticket]?: 'ASC' | 'DESC' | -1 | 1
};

export function transformToSort(sortBy: string[], descending: number) {
  let sortOptions: SortTicket = {};
  sortBy.forEach((sort) => {
    sortOptions = { ...sortOptions, ...{ [sort]: descending } };
  });
  return sortOptions;
}
