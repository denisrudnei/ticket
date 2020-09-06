import ggl from 'graphql-tag';

const fragment = ggl`
fragment categoryList on Category {
  id
  name
  fullName
  description
  defaultGroup {
    id
    name
  }
  subs {
    id
  }
  sla {
    id
    name
  }
  defaultStatus {
    id
    name
  }
  defaultPriority {
    id
    name
  }
  fields {
    required
    min
    max
    text
  }
}`;

export default fragment;
