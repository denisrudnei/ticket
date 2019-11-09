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
      {{ $t('configurations') }}
      <v-icon
        right
        class="white--text"
      >
        settings_applications
      </v-icon>
    </v-btn>
    <v-menu :close-on-content-click="false">
      <template v-slot:activator="{on}">
        <v-btn text class="primary white--text" :title="$t('language')" v-on="on">
          <v-icon>
            language
          </v-icon>
        </v-btn>        
      </template>
      <v-card>
        <v-card-title>
          {{ $t('language') }}
        </v-card-title>
        <v-card-text>
          <v-select v-model="$i18n.locale" :placeholder="$t('language')" filled :items="locales" @change="updateLanguage" />
        </v-card-text>
      </v-card>
    </v-menu>
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
  mounted() {
    const lang = localStorage.getItem('language')
    if (lang) {
      this.$store.commit('locale/setLocale', lang)
      this.$i18n.locale = lang
    }
  },
  computed: mapGetters({
    user: 'auth/getUser',
    locales: 'locale/getLocales'
  }),
  methods: {
    updateLanguage(value) {
      localStorage.setItem('language', value)
      this.$store.commit('locale/setLocale', value)
    },
    logout() {
      this.$store.commit('logout/setLogout', true)
    }
  }
}
</script>

<style>
</style>
