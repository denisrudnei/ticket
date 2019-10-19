<template>
  <v-app-bar
    fixed
    :app="app"
    clipped-right
    clipped-left
    class="primary white--text"
  >
    <v-btn
      to="/"
      icon
      class="primary white--text"
    >
      <v-icon>
        home
      </v-icon>
    </v-btn>
    <v-spacer />
    <v-btn
      v-if="logged"
      text
      icon
      class="primary white--text"
      to="/profile"
    >
      <v-icon>
        person
      </v-icon>
    </v-btn>
    <Notification
      v-if="logged"
    />
    <v-btn v-if="logged && user.role === 'admin'" title="API" icon to="/config/playground" class="white--text">
      <v-icon>format_shapes</v-icon>
    </v-btn>
    <v-btn
      v-if="logged && user.role === 'admin'"
      text
      title="Configurações"
      to="/config"
      class="white--text"
    >
      Configurações
      <v-icon
        right
        class="white--text"
      >
        settings_applications
      </v-icon>
    </v-btn>
    <v-btn
      v-if="logged"
      title="Fazer logoff"
      icon
      text
      class="white-text"
      @click="logout()"
    >
      <v-icon class="white--text">
        exit_to_app
      </v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import Notification from '@/components/notification'

export default {
  components: {
    Notification
  },
  props: {
    app: {
      type: Boolean,
      default: true
    },
    logged: {
      type: Boolean,
      default: false
    }
  },
  computed: mapGetters({
    user: 'auth/getUser'
  }),
  methods: {
    logout() {
      this.$store.commit('logout/setLogout', true)
    }
  }
}
</script>

<style>
</style>
