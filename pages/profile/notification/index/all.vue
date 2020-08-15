<template>
  <div>
    <NotificationList :notifications="notifications" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import NotificationList from '@/components/notification-list';
import list from '@/graphql/query/profile/notification/list.graphql';
import ggl from 'graphql-tag';

export default {
  components: {
    NotificationList,
  },
  computed: mapGetters({
    notifications: 'notification/getNotifications',
  }),
  middleware({ app, store }) {
    app.$apollo.query({
      fetchPolicy: 'no-cache',
      query: ggl(list),
    }).then((response) => {
      store.commit('notification/setNotifications', response.data.notification);
    });
  },

};
</script>

<style></style>
