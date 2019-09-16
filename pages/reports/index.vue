<template>
  <v-row>
    <v-col
      cols="12"
      pa-3
    >
      <h4>Filtros</h4>
      <v-row>
        <v-col
          cols="12"
          md="4"
          pa-3
        >
          <v-autocomplete
            v-model="base.group"
            multiple
            filled
            label="Grupos"
            :items="groups.map(g => {return {text: g.name, value: g}})"
          />    
        </v-col>
        <v-col
          cols="12"
          md="4"
          pa-3
        >
          <v-autocomplete
            v-model="base.status"
            multiple
            filled
            label="Status"
            :items="status.map(g => {return {text: g.name, value: g}})"
          />    
        </v-col>
        <v-col
          cols="12"
          md="4"
          pa-3
        >
          <v-autocomplete
            v-model="base.openedBy"
            multiple
            filled
            label="Aberto por"
            :items="analysts.map(g => {return {text: g.name, value: g}})"
          />    
        </v-col>
      </v-row>
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
      cols="12"
      md="4"
      pa-3
    >
      <v-select
        v-model="selectedContentType"
        label="Tipo do conteúdo"
        :items="contentType"
        filled
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
        Adicionar gráfico
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
        Salvar configurações localmente
        <v-icon
          right
        >
          attach_file
        </v-icon>
      </v-btn>
    </v-col>
    <client-only>
      <v-col
        v-for="chart in charts"
        :key="chart.id"
        cols="12"
        :md="chart.ln || 4"
      >
        <v-card>
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
            <v-select v-model="chart.ln" :items="Array.from({length: 12}, (x, i) => i + 1)" />
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
import _ from 'lodash'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      title: undefined,
      selectedContentType: undefined,
      selectedChartType: undefined,
      chartTypes: [
        {
          text: 'Pizza',
          value: 'pie'
        },
        {
          text: 'Barra',
          value: 'bar'
        }
      ],
      contentType: [
        {
          text: 'Status',
          value: 'status.name'
        },
        {
          text: 'Analista atual',
          value: 'actualUser.name'
        },
        {
          text: 'Grupo',
          value: 'group.name'
        },
        {
          text: 'Categoria',
          value: 'category.name'
        }
      ],
      base: {},
      charts: [],
      chartOptions: {
        chart: {
          id: 'vuechart-example'
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      tickets: 'ticket/getTickets'
    }),
    groups: function() {
      return this.uniq('group')
    },
    analysts: function() {
      return this.uniq('openedBy')
    },
    status: function() {
      return this.uniq('status')
    },
    addDisabled: function() {
      return (
        !this.selectedContentType ||
        !this.selectedChartType ||
        !this.title ||
        this.charts
          .map(c => {
            return c.id
          })
          .includes(this.title)
      )
    }
  },
  async mounted() {
    // TODO
    await this.$axios.get('/ticket').then(response => {
      this.$store.commit('ticket/setTickets', response.data.docs)
    })
    this.charts = JSON.parse(localStorage.getItem('charts')) || []
  },
  methods: {
    save() {
      localStorage.setItem('charts', JSON.stringify(this.charts))
      this.$toast.show('Salvo com sucesso', {
        duration: 1000
      })
    },
    uniq(field) {
      return _.uniqBy(
        this.tickets.map(t => {
          return t[field]
        }),
        f => {
          return f._id
        }
      )
    },
    add() {
      const c = {
        pie: () => this.addPieChart(this.selectedContentType, this.title),
        bar: () => this.addBarChart(this.selectedContentType, this.title)
      }
      c[this.selectedChartType]()
    },
    removeChart(chart) {
      this.charts = this.charts.filter(c => {
        return c.id !== chart.id
      })
    },
    addPieChart(group, title) {
      const chart = {
        id: title,
        series: [],
        type: 'pie',
        options: {}
      }

      const result = _(this.tickets)
        .groupBy(group)
        .value()

      chart.series = Object.keys(result).map(k => {
        return result[k].length
      })
      const chartIndex = this.charts.findIndex(c => {
        return c.id === title
      })
      chart.options.labels = Object.keys(result)
      if (chartIndex === -1) {
        this.charts.push(chart)
      }
    },
    addBarChart(group, title) {
      const chart = {
        id: title,
        series: [],
        type: 'bar',
        options: {}
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
      const chartIndex = this.charts.findIndex(c => {
        return c.id === title
      })
      if (chartIndex === -1) {
        this.charts.push(chart)
      }
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
