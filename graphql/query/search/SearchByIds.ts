import ggl from 'graphql-tag';
import TicketPagination from '@/graphql/fragments/ticketPagination';

// eslint-disable-next-line import/prefer-default-export
export const SearchByIds = ggl`
query SearchByIds ($ids: [ID!]!, $page: Int!, $limit: Int!, $descending: Int!, $sortBy: [String!]!) {
  SearchByIds (ids: $ids, page: $page, limit: $limit, descending: $descending, sortBy: $sortBy) {
    ...ticketPagination
  }
}
${TicketPagination}
`;
