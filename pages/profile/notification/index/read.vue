<template>
  <v-row>
    <v-col cols="12">
      <NotificationList
        :notifications="notifications"
      />
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import NotificationList from '@/components/notification-list'
export default {
  components: {
    NotificationList
  },
  computed: mapGetters({
    notifications: 'notification/getRead'
  })
}
</script>

<style>
</style>
