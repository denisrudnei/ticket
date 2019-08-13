<template>
  <v-dialog :value="logout" max-width="50vw" persistent>
    <v-card>
      <v-card-title class="headline">
        Deseja deslogar do sistema?
      </v-card-title>
      <v-card-actions>
        <v-btn class="primary white--text" block @click="logoutUser()">
          <v-icon left>
            done
          </v-icon>
          Sim
        </v-btn>
        <v-btn class="primary white--text" block @click="back()">
          <v-icon left>
            cancel
          </v-icon>
          Não
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: mapGetters({
    logout: 'logout/getLogout'
  }),
  methods: {
    logoutUser() {
      this.$auth.logout().then(() => {
        this.$router.push('/')
        this.$store.commit('logout/setLogout', false)
      })
    },
    back() {
      this.$store.commit('logout/setLogout', false)
    }
  }
}
</script>

<style>
</style>
