<template>
  <v-row>
    <v-col
      v-for="stat in databaseItemsCount"
      :key="stat.name"
      cols="3"
    >
      <v-card
        class="primary white--text"
        tile
      >
        <v-card-title>
          <span>{{ $t(stat.name) }}</span> <v-spacer /> <h3>{{ stat.total }}</h3>
        </v-card-title>
        <v-card-text class="white--text">
          <v-sparkline
            :value="
              Array.from({ length: 15 }, () => {
                return Math.random() * 100
              })
            "
            color="white"
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ggl from 'graphql-tag';

export default {
  asyncData({ app }) {
    return app.$apollo.query({
      query: ggl`query {
        databaseItemsCount: DatabaseItemsCount {
          ticket
          status
          group
          analyst
          category
          priority
        }
      }`,
    }).then((response) => {
      const databaseItemsCount = Object.entries(response.data.databaseItemsCount).map((value) => {
        const [name, total] = value;
        return { name, total };
      }).filter((value) => value.name !== '__typename');
      return {
        databaseItemsCount,
      };
    });
  },
};
</script>

<style>

</style>
