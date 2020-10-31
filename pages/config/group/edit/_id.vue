<template>
  <create-group
    v-model="group"
    @input="update"
  />
</template>

<script>
import CreateGroup from '@/components/ticket/group/create';
import GetGroup from '@/graphql/query/config/group/getGroup';
import EditGroup from '@/graphql/mutation/config/group/editGroup';

export default {
  components: {
    CreateGroup,
  },
  asyncData({ app, params }) {
    const { id } = params;

    return app.apolloProvider.defaultClient
      .query({
        query: GetGroup,
        variables: {
          id,
        },
      })
      .then((response) => ({
        group: response.data.group,
      }));
  },
  methods: {
    update(group) {
      this.$apollo
        .mutate({
          mutation: EditGroup,
          variables: {
            groupId: group.id,
            group: {
              name: group.name,
              description: group.description,
              analysts: group.analysts.map((analyst) => analyst.id),
            },
          },
        })
        .then(() => {
          this.$toast.show(this.$t('updated'), {
            duration: 5000,
            icon: 'done',
          });
          this.$router.push('/config/group');
        });
    },
  },
};
</script>

<style></style>
