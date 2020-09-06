<template>
  <v-row>
    <v-col>
      <v-treeview
        :items="items"
        item-children="subs"
        on-icon="layers"
        open-on-click
      >
        <template v-slot:prepend>
          <v-icon>layers</v-icon>
        </template>
        <template v-slot:label="{ item }">
          <span @click="getSub(item)">
            {{ item.name }}
          </span>
        </template>
      </v-treeview>
    </v-col>
  </v-row>
</template>

<script>

import category from '@/graphql/query/search/category/category';
import getSubs from '@/graphql/query/search/category/subs';

export default {
  asyncData({ app }) {
    return app.$apollo
      .query({
        query: category,
      })
      .then((response) => ({
        items: response.data.category.filter((c) => c.father === null),
      }));
  },
  methods: {
    getSub(item) {
      this.$apollo
        .query({
          query: getSubs,
          variables: {
            categoryId: item.id,
          },
        })
        .then((response) => response.data.category);
    },
  },
};
</script>

<style></style>
