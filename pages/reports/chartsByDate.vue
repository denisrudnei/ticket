<template>
  <v-row>
    <v-col class="ma-2" cols="12">
      <FilterChart />
      <AddByType :chart-types="chartTypes" :content-type="contentType" />
    </v-col>
    <client-only>
      <v-col
        v-for="chart in charts"
        :key="chart.id"
        cols="12"
        :md="chart.ln || 4"
      >
        <v-card>
          <!-- TODO -->
          <v-slider
            disabled
            :value="chart.ln"
            thumb-label
            :min="4"
            :max="12"
            :step="1"
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
    </client-only>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import FilterChart from '@/components/report/chart/filterChart'
import AddByType from '@/components/report/chart/addByType'
export default {
  components: {
    FilterChart,
    AddByType
  },
  data() {
    return {
      chartTypes: [
        {
          text: 'Line',
          value: 'line'
        },
        {
          text: 'bar',
          value: 'bar'
        }
      ],
      contentType: [
        {
          text: 'Modified',
          value: 'modified',
          ref: 'modified'
        },
        {
          text: 'created',
          value: 'created',
          ref: 'created'
        }
      ]
    }
  },
  computed: mapGetters({
    charts: 'report/getByDateCharts'
  }),
  methods: {
    removeChart(chart) {
      this.$store.commit('report/removeByDateChart', chart)
    }
  }
}
</script>

<style>
</style>
