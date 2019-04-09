<template>
  <v-layout
    row
    wrap
  >
    <no-ssr>
      <v-flex
        v-for="chart in charts"
        :key="chart.id"
        xs12
        md6
        pa-2
      >
        <h5>{{ chart.id }}</h5>
        <apexchart
          width="100%"
          type="bar"
          :options="chartOptions"
          :series="chart.series"
        />
      </v-flex>
    </no-ssr>
  </v-layout>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      charts: [],
      chartOptions: {
        colors: ['#673ab7'],
        chart: {
          id: 'vuechart-example'
        }
      }
    }
  },
  computed: mapGetters({
    tickets: 'ticket/getTickets'
  }),
  async mounted() {
    await this.$axios.get('api/ticket').then(response => {
      this.$store.commit('ticket/setTickets', response.data)
    })
    this.addChart('status.name', 'Chamados por status')
    this.addChart('category.name', 'Chamados por categoria')
    this.addChart('openedBy.name', 'Chamados abertos por analista')
  },
  methods: {
    addChart(group, title) {
      const chart = {
        id: title,
        series: []
      }
      const result = _(this.tickets)
        .groupBy(group)
        .value()

      const serie = {
        name: title,
        data: Object.keys(result).map(key => {
          return {
            x: key,
            y: result[key].length
          }
        })
      }
      this.charts.push(chart)
      const index = this.charts.findIndex(c => {
        return c.id === title
      })
      if (index !== -1) {
        this.charts[index].series.push(serie)
      }
    }
  }
}
</script>

<style>
</style>
