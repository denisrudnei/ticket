<template>
  <v-app>
    <v-navigation-drawer fixed permanent app>
      <v-list>
        <v-list-item to="/client" exact>
          <v-list-item-action>
            <v-icon>home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            Página inicial
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/client/ticket/open">
          <v-list-item-action>
            <v-icon>book</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            {{ $t('create_ticket') }}
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/client/profile">
          <v-list-item-action>
            <v-icon>person</v-icon>
          </v-list-item-action>
          <v-list-item-content>{{ $t('profile') }}</v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-item-action>
          <v-list-item-content>Deslogar</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <v-container fluid>
        <v-row no-gutters>
          <v-col cols="12">
            <nuxt />
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <logout v-if="logged" />
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import logout from '@/components/logout'
export default {
  components: {
    logout
  },
  computed: mapGetters({
    logged: 'auth/getLoggedIn'
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
