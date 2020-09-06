<template>
  <create
    v-model="priority"
    @input="save"
  />
</template>

<script>

import createPriority from '@/graphql/mutation/config/priority/createPriority';
import listPriority from '@/graphql/query/config/priority/priorityList';
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
          mutation: createPriority,
          variables: {
            priority: {
              name: this.priority.name,
              weight: parseInt(this.priority.weight, 10),
            },
          },
          awaitRefetchQueries: true,
          refetchQueries: [{ query: listPriority }],
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
