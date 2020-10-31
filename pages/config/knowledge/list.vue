<template>
  <v-row>
    <v-col cols="12">
      <v-data-table
        :items="items"
        :headers="headers"
      >
        <template #item.name="{ item }">
          {{ item.name }}
        </template>
        <template #item.actions="{ item }">
          <v-btn
            class="primary white--text"
            icon
            :to="`/config/knowledge/edit/${item.id}`"
          >
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn
            class="primary white--text"
            icon
            @click="remove(item)"
          >
            <v-icon>delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import list from '@/graphql/query/knowledge/list';
import removeKnowledge from '@/graphql/mutation/config/knowledge/remove';

export default {
  asyncData({ app }) {
    return app.apolloProvider.defaultClient
      .query({
        query: list,
      })
      .then((response) => ({
        items: response.data.knowledge,
      }));
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t('name'),
          value: 'name',
        },
        {
          text: this.$t('actions'),
          value: 'actions',
        },
      ];
    },
  },
  methods: {
    remove(item) {
      this.$apollo
        .mutate({
          mutation: removeKnowledge,
          variables: {
            id: item.id,
          },
          awaitRefetchQueries: true,
          refetchQueries: [{ query: list }],
        })
        .then(() => {
          this.items = this.items.filter((i) => i.id !== item.id);
          this.$toast.show('Apagado', {
            duration: 5000,
            icon: 'delete',
          });
        });
    },
  },
};
</script>

<style></style>
