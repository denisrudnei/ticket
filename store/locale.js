export const state = () => ({
  locale: 'en',
  locales: [
    {
      text: 'English',
      value: 'en'
    },
    {
      text: 'Português',
      value: 'br'
    }
  ]
})

export const getters = {
  getLocale(state) {
    return state.locale
  },
  getLocales(state) {
    return state.locales
  }
}

export const mutations = {
  setLocale(state, locale) {
    state.locale = locale
  }
}
