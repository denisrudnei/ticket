export const state = () => ({
  analysts: []
})

export const getters = {
  getAnalysts: state => {
    return state.analysts
  }
}

export const mutations = {
  insert(state, analyst) {
    state.analysts.push(analyst)
  },
  setAnalysts: (state, analysts) => {
    state.analysts = analysts
  },
  updateStatus(state, info) {
    const analyst = state.analysts.find(a => {
      return a._id === info.id
    })
    if (analyst) {
      analyst.status = info.status
      state.analysts = [
        analyst,
        ...state.analysts.filter(a => {
          return a._id !== info.id
        })
      ]
    }
  }
}
