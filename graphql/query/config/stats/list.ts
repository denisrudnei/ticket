import ggl from 'graphql-tag';

const query = ggl`query {
  databaseItemsCount: DatabaseItemsCount {
    name
    total
  }
}`;

export default query;
