<template>
  <create
    v-model="priority"
    @input="save"
  />
</template>

<script>
import ggl from 'graphql-tag';
import createPriority from '@/graphql/mutation/config/priority/createPriority.graphql';
import listPriority from '@/graphql/query/config/priority/priorityList.graphql';
import create from '@/components/ticket/priority/create';

export default {
  components: {
    create,
  },
  data() {
    return {
      priority: {
        name: '',
        weight: 0,
      },
    };
  },
  methods: {
    save(priority) {
      this.$apollo
        .mutate({
          mutation: ggl(createPriority),
          variables: {
            priority: {
              name: this.priority.name,
              weight: parseInt(this.priority.weight, 10),
            },
          },
          awaitRefetchQueries: true,
          refetchQueries: [{ query: ggl(listPriority) }],
        })
        .then(() => {
          this.$toast.show('Cadastrado', {
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
