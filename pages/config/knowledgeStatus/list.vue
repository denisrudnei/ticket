<template>
  <v-row>
    <v-col
      cols="12"
      class="pa-2"
    >
      <v-data-table
        :headers="headers"
        :items="status"
      >
        <template #item.name="{ item }">
          {{ item.name }}
        </template>
        <template #item.description="{ item }">
          {{ item.description }}
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import list from '@/graphql/query/config/knowledgeStatus/list';

export default {
  asyncData({ app }) {
    return app.apolloProvider.defaultClient
      .query({
        query: list,
      })
      .then((response) => ({
        status: response.data.KnowledgeStatus,
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
          text: this.$t('description'),
          value: 'description',
        },
      ];
    },
  },
};
</script>

<style></style>
