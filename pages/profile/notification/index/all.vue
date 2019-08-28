<template>
  <div>
    <NotificationList
      :notifications="notifications"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import NotificationList from '@/components/notification-list'
export default {
  components: {
    NotificationList
  },

  computed: mapGetters({
    notifications: 'notification/getNotifications'
  })
}
</script>

<style>
</style>
