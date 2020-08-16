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
        @add="add"
      />
    </v-col>
    <client-only>
      <v-col class="ma-3">
        <v-row>
          <v-col
            v-for="chart in charts"
            :key="chart.id"
            cols="12"
            :md="chart.ln || 4"
            class="pa-2"
          >
            <v-card>
              <!-- TODO -->
              <v-select
                disabled
                :value="chart.ln"
                :items="Array.from({ length: 12 }, (x, i) => i + 1)"
              />
              <v-card-title>
                <h5>{{ chart.id }}</h5>
              </v-card-title>
              <v-card-text>
                <apexchart
                  width="100%"
                  :options="chart.options"
                  :type="chart.type"
                  :series="chart.series"
                />
              </v-card-text>
              <v-card-actions>
                <v-btn
                  icon
                  class="red white--text"
                  @click="removeChart(chart)"
                >
                  <v-icon>
                    delete
                  </v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </client-only>
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
      report: null,
      chartTypes: [
        {
          text: 'Pizza',
          value: 'pie',
        },
        {
          text: 'Barra',
          value: 'bar',
        },
        {
          text: 'Line',
          value: 'line',
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
      base: {},
      chartOptions: {
        chart: {
          id: 'vuechart-example',
        },
      },
    };
  },
  computed: mapGetters({
    charts: 'report/getGroupedCharts',
  }),
  mounted() {
    this.$store.commit('report/loadFromLocalStorage');
  },
  methods: {
    add(chart) {
      this.charts.push(chart);
    },
    removeChart(chart) {
      this.$store.commit('report/removeGroupedChart', chart);
    },
  },
};
</script>

<style></style>
