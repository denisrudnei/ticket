<template>
  <create
    v-model="priority"
    @input="save"
  />
</template>

<script>
import ggl from 'graphql-tag';
import create from '@/components/ticket/priority/create';
import priorityEdit from '@/graphql/query/config/priority/priorityEdit.graphql';
import updatePriority from '@/graphql/mutation/config/priority/updatePriority.graphql';
import priorityList from '@/graphql/query/config/priority/priorityList.graphql';

export default {
  components: {
    create,
  },
  asyncData({ app, params }) {
    return app.$apollo
      .query({
        query: ggl(priorityEdit),
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
      const { id } = this.$route.params;
      this.$apollo
        .mutate({
          mutation: ggl(updatePriority),
          variables: {
            priority: {
              ...this.priority,
              id,
            },
          },
          awaitRefetchQueries: true,
          refetchQueries: [{ query: ggl(priorityList) }],
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
