import { mapGetters } from 'vuex'
import ggl from 'graphql-tag'
import mergeUser from '@/graphql/mutation/auth/mergeUser.graphql'
export default {
  computed: mapGetters({
    user: 'auth/getUser'
  }),
  methods: {
    changeColor() {
      this.$vuetify.theme.currentTheme.primary =
        this.user.color || this.$vuetify.theme.currentTheme.primary
    },
    processInfo() {
      const { name, status, contactEmail, description } = this.user
      const user = { name, status, contactEmail, description }
      this.$apollo
        .mutate({
          mutation: ggl(mergeUser),
          variables: {
            email: this.user.email,
            user: user
          }
        })
        .then(response => {
          this.$store.commit('auth/mergeUser', response.data.MergeUser)
          this.changeColor()
        })
    }
  }
}
