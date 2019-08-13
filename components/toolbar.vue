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
      
    <v-menu
      v-if="logged"
      offset-y
      offset-x
      :nudge-width="250"
      max-width="35vw"
      :close-on-content-click="false"
      max-height="65vh"
    >
      <template v-slot:activator="{on}">
        <v-btn class="primary white--text" icon v-on="on">
          <v-icon>
            chat
          </v-icon>
        </v-btn>
      </template>
      <v-tabs class="primary white--text">
        <v-tab>
          Usuários
        </v-tab>
        <v-tab-item>
          <analyst-list
            v-if="logged"
          />
        </v-tab-item>
        <v-tab>
          Status
        </v-tab>
        <v-tab-item>
          <v-card>
            <status />
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-menu>
    <Notification
      v-if="logged"
    />
    <v-btn
      v-if="logged && user.role === 'admin'"
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
      title="Fazer logoff"
      icon
      flat
      class="primary white-text"
      @click="logout()"
    >
      <v-icon>
        exit_to_app
      </v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
import { mapGetters } from 'vuex'
import Notification from '@/components/notification'
import AnalystList from '@/components/chat/analyst-list'
import Status from '@/components/chat/status'

export default {
  components: {
    Notification,
    AnalystList,
    Status
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
