import ggl from 'graphql-tag';

const fragment = ggl`
fragment ticketList on Ticket {
  id
  priority {
    id
    name
  }
  openedBy {
    id
    name
  }
  affectedUser {
    id
    name
  }
  address {
    id
    name
  }
  actualUser {
    id
    name
    picture
  }
  category {
    id
    fullName
    name
  }
  group {
    id
    name
  }
  status {
    id
    name
    allowedStatus {
      id
      name
    }
  }
  resume
  created
  modified
}`;

export default fragment;
