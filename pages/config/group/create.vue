<template>
  <create-group @input="save" />
</template>

<script>
import CreateGroup from '@/components/ticket/group/create';
import create from '@/graphql/mutation/config/group/create';
import list from '@/graphql/query/config/group/list';

export default {
  components: {
    CreateGroup,
  },
  methods: {
    save(group) {
      group.analysts = group.analysts.map((analyst) => analyst.id);
      this.$apollo
        .mutate({
          mutation: create,
          variables: {
            group,
          },
          awaitRefetchQueries: true,
          refetchQueries: [{ query: list }],
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
