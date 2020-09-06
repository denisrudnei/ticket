<template>
  <v-row>
    <v-col
      cols="12"
      pa-3
    >
      <v-data-table
        :items="roles"
        :headers="headers"
      >
        <template v-slot:item.name="{ item }">
          {{ item.name }}
        </template>
        <template v-slot:item.description="{ item }">
          {{ item.description }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            class="primary white--text"
            icon
            :to="`/config/permissions/edit/${item.id}`"
          >
            <v-icon>
              edit
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>

import RoleList from '@/graphql/query/role/list';

export default {
  asyncData({ app }) {
    return app.$apollo
      .query({
        query: RoleList,
      })
      .then((response) => ({
        roles: response.data.roles,
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
        {
          text: this.$t('actions'),
          value: 'actions',
        },
      ];
    },
  },
};
</script>

<style></style>
