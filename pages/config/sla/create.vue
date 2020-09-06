<template>
  <create @input="create" />
</template>

<script>

import create from '@/components/ticket/sla/create';
import createSla from '@/graphql/mutation/config/sla/createSla';
import slaList from '@/graphql/query/config/sla/slaList';

export default {
  components: {
    create,
  },
  methods: {
    create(sla) {
      const [hour, minutes] = sla.limit.split(':');

      this.$apollo
        .mutate({
          mutation: createSla,
          variables: {
            sla: {
              name: sla.name,
              limit: new Date(
                Date.UTC(1970, 0, 1, parseInt(hour, 10), parseInt(minutes, 10)),
              ),
            },
          },
          awaitRefetchQueries: true,
          refetchQueries: [{ query: slaList }],
        })
        .then(() => {
          this.$toast.show('Cadastrado com sucesso', {
            duration: 1000,
            icon: 'done',
          });
        });
    },
  },
};
</script>

<style></style>
