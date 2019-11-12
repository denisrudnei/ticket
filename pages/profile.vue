<template>
  <v-row>
    <v-col
      cols="12"
      pa-1
    >
      <v-tabs color="primary" class="white--text" show-arrows>
        <v-tab
          to="/profile"
        >
          <v-icon left>
            person
          </v-icon>
          Perfil
        </v-tab>
        <v-tab to="/profile/sound">
          <v-icon left>
            volume_up
          </v-icon>
          Configuração de áudio
        </v-tab>
        <v-tab to="/profile/path/view">
          <v-icon left>
            subdirectory_arrow_right
          </v-icon>
          Listagem em árvore
        </v-tab>
        <v-tab
          to="/profile/notification/all"
        >
          <v-icon left>
            notification_important
          </v-icon>
          Notificações
        </v-tab>
        <v-tab
          to="/profile/password"
        >
          <v-icon left>
            lock
          </v-icon>
          {{ $t('password') }}
        </v-tab>
      </v-tabs>
      <nuxt-child />
    </v-col>
  </v-row>
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
    await this.$axios.post(`/notification/`).then(response => {
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
