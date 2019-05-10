<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
      pa-2
    >
      <v-tabs>
        <v-tab
          to="/profile"
        >
          Perfil
        </v-tab>
        <v-tab
          to="/profile/notification"
        >
          Notificações
        </v-tab>
        <v-tab
          to="/profile/password"
        >
          Senha
        </v-tab>
      </v-tabs>
      <nuxt-child />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: mapGetters({
    user: 'auth/getUser'
  }),
  async created() {
    await this.$axios.post(`/notification/${this.user._id}`).then(response => {
      this.$store.commit('notification/setNotifications', response.data)
    })
    await this.$axios
      .post(`/analyst/${this.user._id}/groups`)
      .then(response => {
        this.notificationGroups = response.data
      })
  }
}
</script>

<style>
</style>
