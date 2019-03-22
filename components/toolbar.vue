<template>
  <v-toolbar
    :clipped-left="clipped"
    fixed
    :app="app"
    :card="!app"
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
      flat
      icon
      class="primary white--text"
      to="/profile"
    >
      <v-icon>
        person
      </v-icon>
    </v-btn>
    <Notification />
    <v-btn
      v-if="logged"
      flat
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
      to="/auth/logout"
      title="Fazer logoff"
      icon
      flat
      class="primary white-text"
    >
      <v-icon>
        exit_to_app
      </v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
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
    },
    clipped: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style>
</style>
