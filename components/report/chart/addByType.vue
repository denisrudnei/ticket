<template>
  <v-row>
    <v-col
      cols="12"
      md="4"
      pa-3
    >
      <v-menu
        v-model="startMenu"
        :close-on-content-click="false"
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field label="Start" filled :value="start" v-on="on" />
        </template>
        <v-date-picker
          v-model="start"
          label="start"
          @input="startMenu = false"
        />
      </v-menu>
    </v-col>
    <v-col
      cols="12"
      md="4"
      pa-3
    >
      <v-menu
        v-model="endMenu"
        :close-on-content-click="false"
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field label="end" filled :value="end" v-on="on" />
        </template>
        <v-date-picker
          v-model="end"
          label="end"
          @input="endMenu = false"
        />
      </v-menu>
    </v-col>
    <v-col
      cols="12"
      md="4"
      pa-3
    >
      <v-select
        v-model="selectedChartType"
        :items="chartTypes"
        filled
        label="Tipo do gráfico"
      />
    </v-col>
    <v-col
      v-if="contentType.length > 0"
      cols="12"
      md="4"
      pa-3
    >
      <v-select
        v-model="selectedContentType"
        label="Tipo do conteúdo"
        :items="contentType"
        filled
        @input="changeSelectedRef"
      />
    </v-col>
    <v-col
      md="4"
      cols="12"
      pa-3
    >
      <v-text-field
        v-model="title"
        filled
        label="Nome do gráfico"
      />
    </v-col>
    <v-col
      cols="12"
      pa-3
    >
      <v-btn
        :disabled="addDisabled"
        class="primary"
        @click="add()"
      >
        {{ $t('add_chart') }}
        <v-icon
          right
        >
          add
        </v-icon>
      </v-btn>
      <v-btn
        class="primary"
        @click="save()"
      >
        {{ $t('save_configurations_locally') }}
        <v-icon
          right
        >
          attach_file
        </v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import ggl from 'graphql-tag'
import getGrouped from '@/graphql/query/report/getGrouped.graphql'
import getByDate from '@/graphql/query/report/getByDate.graphql'
export default {
  props: {
    chartTypes: {
      type: Array,
      default: () => []
    },
    contentType: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      startMenu: null,
      endMenu: null,
      start: null,
      end: null,
      title: undefined,
      selectedContentType: undefined,
      selectedRef: undefined,
      selectedChartType: undefined
    }
  },
  computed: {
    ...mapGetters({
      charts: 'report/getCharts',
      base: 'report/filter/getBase'
    }),
    addDisabled: function() {
      if (this.contentType.length === 0) {
        return (
          !this.selectedChartType || !this.title || this.checkRepeatedName()
        )
      }
      return (
        !this.selectedContentType ||
        !this.selectedChartType ||
        !this.title ||
        this.checkRepeatedName()
      )
    }
  },
  methods: {
    save() {
      this.$store.commit('report/save')
      this.$toast.show(this.$t('saved_successfully'), {
        duration: 1000
      })
    },
    checkRepeatedName() {
      return this.charts
        .map(c => {
          return c.id
        })
        .includes(this.title)
    },
    changeSelectedRef(ref) {
      this.selectedRef = this.contentType.find(item => {
        return item.value === ref
      }).ref
    },
    add() {
      const c = {
        pie: () => this.addPieChart(this.selectedContentType, this.title),
        bar: () => this.addBarChart(this.selectedContentType, this.title),
        line: () => this.addAreaChart(this.title),
        tile: () => this.addTile(this.selectedContentType, this.title)
      }
      c[this.selectedChartType]()
    },
    async queryFiltred() {
      await this.$apollo
        .query({
          query: ggl(getGrouped),
          variables: {
            attributes: this.base,
            field: this.selectedContentType,
            ref: this.selectedRef
          }
        })
        .then(response => {
          this.report = response.data.TicketReport
        })
    },
    addAreaChart(title) {
      this.$apollo
        .query({
          query: ggl(getByDate),
          variables: {
            field: this.selectedContentType,
            start: this.start,
            end: this.end
          }
        })
        .then(response => {
          let data = response.data.ReportByDate
          const chart = {
            id: title,
            stroke: {
              curve: 'smooth'
            },
            series: [],
            type: 'area',
            options: {
              xaxis: {
                type: 'datetime'
              }
            }
          }

          data = data.sort((a, b) => {
            if (a.id > b.id) return 1
            if (a.id < b.id) return -1
            return 0
          })

          chart.series.push({
            data: data.map(value => value.total)
          })

          chart.options.labels = data.map(value => value.id)
          this.$store.commit('report/addByDateChart', chart)
        })
    },
    async addPieChart(group, title) {
      await this.queryFiltred()

      const chart = {
        id: title,
        series: [],
        type: 'pie',
        options: {}
      }

      chart.series = this.report.map(value => value.total)

      chart.options.labels = this.report.map(value => value.name)

      this.$store.commit('report/addGroupedChart', chart)
    },
    async addBarChart(group, title) {
      await this.queryFiltred()
      const chart = {
        id: title,
        series: [],
        type: 'bar',
        options: {}
      }

      const serie = {
        name: title,
        data: this.report.map(value => {
          return {
            x: value.name,
            y: value.total
          }
        })
      }
      chart.series.push(serie)
      this.$store.commit('report/addGroupedChart', chart)
    },
    async addTile(contentType) {
      await this.queryFiltred()
      const tiles = this.report.map(item => {
        return {
          title: item.name,
          value: item.total
        }
      })
      this.$store.commit('report/setTiles', tiles)
    }
  }
}
</script>

<style>
</style>
