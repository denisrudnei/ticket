<template>
  <v-row>
    <v-col>
      <v-list two-line>
        <v-list-item
          v-for="group in groups"
          :key="group.id"
          :to="`/search/group/${group.id}`"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ group.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ group.description }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>

<script>

import list from '@/graphql/query/group/list';

export default {
  asyncData({ app }) {
    return app.$apollo.query({
      query: list,
    }).then((response) => ({
      groups: response.data.Group,
    }));
  },
};
</script>

<style>

</style>
