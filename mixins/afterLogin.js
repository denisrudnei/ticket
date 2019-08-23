import { mapGetters } from 'vuex'
export default {
  computed: mapGetters({
    user: 'auth/getUser'
  }),
  methods: {
    changeColor() {
      this.$vuetify.theme.currentTheme.primary =
        this.user.color || this.$vuetify.theme.currentTheme.primary
    },
    async processInfo() {
      const loggedUser = await this.$axios.post('/auth/user')
      this.$axios
        .post('/auth/mergeUser', loggedUser.data.user)
        .then(response => {
          this.$store.commit('auth/mergeUser', response.data)
          if (process.browser) {
            this.checkNotifications(response.data)
          }
          this.changeColor()
        })
    },
    checkNotifications(user) {
      this.$axios.post(`/analyst/${user._id}/groups`).then(responseGroups => {
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
