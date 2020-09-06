<template>
  <v-row>
    <v-col cols="12">
      <knowledge-list />
    </v-col>
  </v-row>
</template>

<script>
import KnowledgeList from '@/components/knowledge/list';
import List from '@/graphql/query/knowledge/list';

export default {
  components: {
    KnowledgeList,
  },
  asyncData({ app }) {
    return app.$apollo
      .query({
        query: List,
      })
      .then((response) => ({
        items: response.data,
      }));
  },
  computed: {
    headers() {
      return [
        {
          text: 'Id',
          value: 'id',
        },
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
};
</script>

<style></style>
