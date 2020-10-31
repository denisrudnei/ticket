<template>
  <v-row>
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="items"
      >
        <template #item.name="{ item }">
          {{ item.fullName }}
        </template>
        <template #item.father="{ item }">
          {{
            item.father !== undefined && item.father !== null
              ? item.father.fullName
              : 'orfão'
          }}
        </template>
        <template #item.group="{ item }">
          {{ !item.defaultGroup ? '' : item.defaultGroup.name }}
        </template>
        <template #item.children="{ item }">
          {{ item.subs !== undefined ? item.subs.length : 0 }}
        </template>
        <template #item.edit="{ item }">
          <v-btn
            icon
            class="primary white--text"
            :to="`/config/category/edit/${item.name}`"
          >
            <v-icon>edit</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>

import categoryList from '@/graphql/query/config/category/categoryList';

export default {
  asyncData({ params, app }) {
    return app.apolloProvider.defaultClient
      .query({
        query: categoryList,
        variables: {
          name: params.name,
        },
      })
      .then((response) => ({
        items: response.data.category,
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
          text: 'Categoria pai',
          value: 'father',
        },
        {
          text: 'Quantidade de filhas',
          value: 'children',
        },
        {
          text: this.$t('group'),
          value: 'group',
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
