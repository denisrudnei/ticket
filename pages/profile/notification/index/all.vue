<template>
  <div>
    <NotificationList :notifications="notifications" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import NotificationList from '@/components/notification-list';
import list from '@/graphql/query/profile/notification/list';

export default {
  components: {
    NotificationList,
  },
  middleware({ app, store }) {
    app.apolloProvider.defaultClient.query({
      fetchPolicy: 'no-cache',
      query: list,
    }).then((response) => {
      store.commit('notification/setNotifications', response.data.notification);
    });
  },
  computed: mapGetters({
    notifications: 'notification/getNotifications',
  }),
};
</script>

<style></style>
