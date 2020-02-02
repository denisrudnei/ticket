export const state = () => ({
  charts: {
    byDate: [],
    grouped: []
  },
  tiles: []
})

export const getters = {
  getGroupedCharts(state) {
    return state.charts.grouped
  },
  getByDateCharts(state) {
    return state.charts.byDate
  },
  getCharts(state) {
    return state.charts.byDate.concat(state.charts.grouped)
  },
  getTiles(state) {
    return state.tiles
  },
  getBase(state) {
    return state.base
  }
}

export const mutations = {
  addGroupedChart(state, chart) {
    state.charts.grouped.push(chart)
  },
  addByDateChart(state, chart) {
    state.charts.byDate.push(chart)
  },
  removeGroupedChart(state, chart) {
    state.charts.grouped = state.charts.grouped.filter(c => {
      return c.id !== chart.id
    })
  },
  removeByDateChart(state, chart) {
    state.charts.byDate = state.charts.byDate.filter(c => {
      return c.id !== chart.id
    })
  },
  setTiles(state, tiles) {
    state.tiles = tiles
  },
  save(state) {
    localStorage.setItem('charts', JSON.stringify(state.charts))
  },
  loadFromLocalStorage(state) {
    state.charts = JSON.parse(localStorage.getItem('charts')) || state.charts
  }
}
