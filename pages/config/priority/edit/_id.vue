<template>
  <create
    v-model="priority"
    @input="save"
  />
</template>

<script>

import create from '@/components/ticket/priority/create';
import priorityEdit from '@/graphql/query/config/priority/priorityEdit';
import updatePriority from '@/graphql/mutation/config/priority/updatePriority';
import priorityList from '@/graphql/query/config/priority/priorityList';

export default {
  components: {
    create,
  },
  asyncData({ app, params }) {
    return app.$apollo
      .query({
        query: priorityEdit,
        variables: {
          id: params.id,
        },
      })
      .then((result) => ({
        priority: result.data.priority,
      }));
  },
  methods: {
    save() {
      const { idToEdit } = this.$route.params;
      const { id, ...priority } = this.priority;
      this.$apollo
        .mutate({
          mutation: updatePriority,
          variables: {
            priority: {
              ...priority,
              id: idToEdit,
            },
          },
          awaitRefetchQueries: true,
          refetchQueries: [{ query: priorityList }],
        })
        .then(() => {
          this.$toast.show('Prioridade atualizada', {
            duration: 1000,
            icon: 'done',
          });
          this.$router.push('/config/priority/list');
        });
    },
  },
};
</script>

<style></style>
