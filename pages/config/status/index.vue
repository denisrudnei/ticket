<template>
  <v-row>
    <v-col cols="12">
      <v-data-table
        :items="status"
        :headers="headers"
      >
        <template #item.name="{ item }">
          {{ item.name }}
        </template>
        <template #item.edit="{ item }">
          <v-btn
            icon
            class="primary white--text"
            :to="`/config/status/edit/${item.id}`"
          >
            <v-icon>edit</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import StatusList from '@/graphql/query/status/list';

export default {
  asyncData({ app }) {
    return app.apolloProvider.defaultClient
      .query({
        query: StatusList,
      })
      .then((response) => ({
        status: response.data.Status,
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
          text: this.$t('edit'),
          value: 'edit',
        },
      ];
    },
  },
};
</script>

<style></style>
