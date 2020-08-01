<template>
  <create-group @input="save" />
</template>

<script>
import CreateGroup from '@/components/ticket/group/create';
import create from '@/graphql/mutation/config/group/create.graphql';
import list from '@/graphql/query/config/group/list.graphql';
import ggl from 'graphql-tag';

export default {
  components: {
    CreateGroup,
  },
  methods: {
    save(group) {
      group.analysts = group.analysts.map((analyst) => analyst.id);
      this.$apollo
        .mutate({
          mutation: ggl(create),
          variables: {
            group,
          },
          awaitRefetchQueries: true,
          refetchQueries: [{ query: ggl(list) }],
        })
        .then(() => {
          this.$toast.show('Grupo criado', {
            duration: 1000,
          });
          this.$router.push('/config/group');
        })
        .catch(() => {
          this.$toast.error('Falha ao cadastrar grupo');
        });
    },
  },
};
</script>

<style></style>
