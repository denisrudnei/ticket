<template>
  <v-row>
    <v-col cols="12">
      <v-tabs show-arrows>
        <v-tab to="/profile/notification/all">
          {{ $t('all_notifications') }}
        </v-tab>
        <v-tab to="/profile/notification/read">
          {{ $t('read') }}
        </v-tab>
        <v-tab to="/profile/notification/unread">
          {{ $t('unread') }}
        </v-tab>
      </v-tabs>
    </v-col>
    <v-col>
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';

import NotificationList from '@/graphql/query/profile/notification/list';

export default {
  computed: mapGetters({
    notifications: 'notification/getNotifications',
  }),
  created() {
    this.$apollo
      .query({
        query: NotificationList,
      })
      .then((response) => {
        this.$store.commit(
          'notification/setNotifications',
          response.data.notification,
        );
      });
  },
};
</script>

<style></style>
