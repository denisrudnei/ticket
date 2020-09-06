<template>
  <status-create @input="save" />
</template>

<script>
import StatusCreate from '@/components/ticket/status/create';
import create from '@/graphql/mutation/config/status/create';
import list from '@/graphql/query/status/list';

export default {
  components: {
    StatusCreate,
  },
  methods: {
    save(status) {
      const newStatus = {
        ...status,
        allowedStatus: status.allowedStatus.map((s) => s.id),
      };
      this.$apollo
        .mutate({
          mutation: create,
          variables: {
            status: newStatus,
          },
          awaitRefetchQueries: true,
          refetchQueries: [{ query: list }],
        })
        .then(() => {
          this.$toast.show('Status criado', {
            duration: 1000,
          });
        });
      this.$router.push('/config/status/');
    },
  },
};
</script>

<style></style>
