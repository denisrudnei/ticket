<template>
  <v-row>
    <v-col
      cols="12"
      pa-1
    >
      <v-tabs
        color="primary"
        class="white--text"
        show-arrows
      >
        <v-tab to="/profile">
          <v-icon left>
            person
          </v-icon>
          {{ $t('profile') }}
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
        <v-tab to="/profile/notification/all">
          <v-icon left>
            notification_important
          </v-icon>
          {{ $t('notifications') }}
        </v-tab>
        <v-tab to="/profile/password">
          <v-icon left>
            lock
          </v-icon>
          {{ $t('password') }}
        </v-tab>
      </v-tabs>
    </v-col>
    <v-col cols="12">
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';
import GroupList from '@/graphql/query/profile/groups';
import list from '@/graphql/query/profile/list';

export default {
  asyncData({ params, app }) {
    return app.apolloProvider.defaultClient.query({
      query: list,
    }).then((response) => ({
      user: response.data.user,
    }));
  },
  created() {
    this.$apollo
      .query({
        query: GroupList,
        variables: {
          id: this.user.id,
        },
      })
      .then((response) => {
        this.notificationGroups = response.data.AnalystById;
      });
  },
};
</script>

<style></style>
