<template>
  <create-status
    v-model="status"
    @input="update"
  />
</template>

<script>
import CreateStatus from '@/components/ticket/status/create';
import StatusById from '@/graphql/query/status/statusById';
import list from '@/graphql/query/status/list';
import edit from '@/graphql/mutation/config/status/edit';

export default {
  components: {
    CreateStatus,
  },
  asyncData({ app, params }) {
    const { id } = params;
    return app.$apollo
      .query({
        query: StatusById,
        variables: {
          id,
        },
      })
      .then((response) => ({
        status: response.data.FindStatus,
      }));
  },
  methods: {
    update(status) {
      this.$apollo
        .mutate({
          mutation: edit,
          variables: {
            id: status.id,
            status: {
              name: status.name,
              description: status.description,
              allowedStatus: status.allowedStatus.map((s) => s.id),
              slaRun: status.slaRun,
            },
          },
          awaitRefetchQueries: true,
          refetchQueries: [
            { query: StatusById, variables: { id: status.id } }, { query: list },
          ],
        })
        .then(() => {
          this.$toast.show(this.$t('updated'), {
            duration: 1000,
            icon: 'done',
          });
          this.$router.push('/config/status/');
        });
    },
  },
};
</script>

<style></style>
