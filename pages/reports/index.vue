<template>
  <v-row>
    <v-row>
      <v-col>
        <v-tabs>
          <v-tab>
            Gráficos
          </v-tab>
          <v-tab-item>
            <GroupedChart />
          </v-tab-item>
          <v-tab>
            Tiles
          </v-tab>
          <v-tab-item>
            <Tiles />
          </v-tab-item>
          <v-tab>
            Por data
          </v-tab>
          <v-tab-item>
            <ChartsByDate />
          </v-tab-item>
        </v-tabs>
      </v-col>
    </v-row>
  </v-row>
</template>

<script>
import Tiles from './tiles';
import GroupedChart from './groupedCharts';
import ChartsByDate from './chartsByDate';

export default {
  components: {
    Tiles,
    GroupedChart,
    ChartsByDate,
  },
};
</script>

<style></style>
