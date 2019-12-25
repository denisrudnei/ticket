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
    <v-menu v-if="logged" :close-on-content-click="false" class=".d-flex .d-sm-none" :nudge-width="250">
      <template v-slot:activator="{ on }">
        <v-btn text class="primary white--text" v-on="on">
          <v-icon>
            view_module
          </v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="option in options" :key="option.text" :to="option.to" exact>
          <v-list-item-action>
            <v-icon>
              {{ option.icon }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            {{ $t(option.text) }}
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
    <Notification
      v-if="logged"
    />
    <language />
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
import Language from '@/components/language'
export default {
  components: {
    Notification,
    Language
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
  data() {
    return {
      options: [
        {
          title: 'profile',
          text: 'profile',
          icon: 'person',
          to: '/profile'
        },
        {
          title: 'API',
          text: 'API',
          icon: 'format_shapes',
          to: '/config/playground'
        },
        {
          title: 'configurations',
          text: 'configurations',
          icon: 'settings_applications',
          to: '/config'
        }
      ]
    }
  },
  computed: mapGetters({
    user: 'auth/getUser'
  }),
  mounted() {
    const lang = localStorage.getItem('language')
    if (lang) {
      this.$store.commit('locale/setLocale', lang)
      this.$i18n.locale = lang
    }
  },
  methods: {
    logout() {
      this.$store.commit('logout/setLogout', true)
    }
  }
}
</script>

<style>
</style>
