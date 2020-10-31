<template>
  <v-data-table
    :headers="headers"
    :items="items"
    pagination.sync="pagination"
  >
    <template #item.name="{ item }">
      <nuxt-link :to="`/knowledge/view/${item.id}`">
        {{ item.name }}
      </nuxt-link>
    </template>
    <template #item.created="{ item }">
      {{ item.created | date }}
    </template>
    <template #item.status="{ item }">
      {{ item.status.name }}
    </template>
  </v-data-table>
</template>

<script>

import KnowledgeListByGroup from '@/graphql/query/knowledge/listByGroup';
import KnowledgeListAll from '@/graphql/query/knowledge/list';

export default {
  data() {
    return {
      items: [],
    };
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t('name'),
          value: 'name',
        },
        {
          text: this.$t('creation_date'),
          value: 'created',
        },
        {
          text: this.$t('status'),
          value: 'status',
        },
      ];
    },
  },
  watch: {
    $route(newValue) {
      if (newValue.params.groupName) {
        this.$apollo
          .query({
            query: KnowledgeListByGroup,
            variables: {
              groupName: newValue.params.groupName,
            },
          })
          .then((response) => {
            this.items = response.data.knowledge;
          });
      }
    },
  },
  mounted() {
    const { groupName } = this.$route.params;
    const query = groupName ? KnowledgeListByGroup : KnowledgeListAll;
    this.$apollo
      .query({
        query,
        variables: {
          groupName,
        },
      })
      .then((response) => {
        this.items = response.data.knowledge;
      });
  },
};
</script>

<style></style>
