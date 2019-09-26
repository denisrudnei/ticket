export default {
  methods: {
    setApolloUrl() {
      this.$apollo.getClient().wsClient.url = `ws://${
        window.location.host
      }/api/subscriptions`
    }
  }
}
