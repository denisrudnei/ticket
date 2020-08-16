<template>
  <v-row>
    <v-col
      cols="12"
      class="ma-2"
    >
      <FilterChart />
      <AddByType
        :chart-types="chartTypes"
        :content-type="contentType"
        @add="addTiles"
      />
    </v-col>

    <v-col class="ma-2">
      <v-row>
        <v-col
          v-for="tile in tiles"
          :key="tile.name"
          cols="12"
          md="4"
        >
          <v-card class="ma-2 pa-2 primary white--text">
            <v-card-title> {{ tile.title }} ({{ tile.value }}) </v-card-title>
            <hr>
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
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';
import FilterChart from '@/components/report/chart/filterChart';
import AddByType from '@/components/report/chart/addByType';

export default {
  components: {
    FilterChart,
    AddByType,
  },
  data() {
    return {
      base: {},
      chartTypes: [
        {
          text: 'Tile',
          value: 'tile',
        },
      ],
      contentType: [
        {
          text: 'Status',
          value: 'status',
          ref: 'status',
        },
        {
          text: 'Analista atual',
          value: 'actualUser',
          ref: 'analysts',
        },
        {
          text: 'Grupo',
          value: 'group',
          ref: 'groups',
        },
        {
          text: 'Categoria',
          value: 'category',
          ref: 'categories',
        },
      ],
    };
  },
  computed: mapGetters({
    groups: 'group/getGroups',
    analysts: 'analyst/getAnalysts',
    status: 'status/getStatus',
    tiles: 'report/getTiles',
  }),
  methods: {
    addTiles(tiles) {
      this.$store.commit('report/setTiles', tiles);
    },
  },
};
</script>

<style></style>
