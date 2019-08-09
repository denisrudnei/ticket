export default {
  methods: {
    changeColor() {
      this.$vuetify.theme.primary =
        this.user.color || this.$vuetify.theme.primary
    },
    async processInfo() {
      const loggedUser = await this.$axios.post('/auth/user')
      this.$axios
        .post('/auth/mergeUser', loggedUser.data.user)
        .then(response => {
          this.user = response.data
          if (process.browser) {
            this.checkNotifications()
          }
          this.changeColor()
        })
    },
    checkNotifications() {
      this.$axios
        .post(`/analyst/${this.user._id}/groups`)
        .then(responseGroups => {
          responseGroups.data
            .filter(g => {
              return g.analysts.map(a => a._id).includes(this.user._id)
            })
            .forEach(group => {
              this.$socket.on(`notification/${group._id}`, notification => {
                this.$store.commit('notification/addNotification', notification)
              })
            })

          this.$socket.on('readNotification', notification => {
            this.$store.commit('notification/updateNotification', notification)
          })
        })
    }
  }
}
