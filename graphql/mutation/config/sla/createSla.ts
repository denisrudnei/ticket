import ggl from 'graphql-tag';

const mutation = ggl`
mutation CreateSla($sla: SlaAttributes!) {
  CreateSla(sla: $sla) {
    name
    limit
  }
}
`;

export default mutation;
