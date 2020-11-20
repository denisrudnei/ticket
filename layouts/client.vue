<template>
  <v-app>
    <v-app-bar
      app
      fixed
      clipped-left
      class="primary"
      flat
    >
      <v-btn
        to="/client"
        class="primary white--text"
        text
        icon
        exact
      >
        <v-icon>home</v-icon>
      </v-btn>
      <v-spacer />
      <language />
    </v-app-bar>
    <v-navigation-drawer
      fixed
      permanent
      app
      clipped
    >
      <v-list>
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
          <v-list-item-content>{{ $t('logout') }}</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid>
        <v-row no-gutters>
          <v-col cols="12">
            <nuxt />
          </v-col>
        </v-row>
      </v-container>
      <logout v-if="logged" />
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import Language from '@/components/language';
import logout from '@/components/logout';

export default {
  components: {
    Language,
    logout,
  },
  computed: {
    logged() {
      return this.$auth.loggedIn;
    },
  },
  methods: {
    logout() {
      this.$store.commit('logout/setLogout', true);
    },
  },
};
</script>

<style></style>
