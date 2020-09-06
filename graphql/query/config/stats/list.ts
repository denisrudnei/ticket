import ggl from 'graphql-tag';

const query = ggl`query {
  databaseItemsCount: DatabaseItemsCount {
    ticket
    status
    group
    analyst
    category
    priority
  }
}`;

export default query;
