<template>
  <v-layout
    row
    wrap
  >
    <v-flex xs12>
      <NotificationList
        :notifications="notifications"
      />
    </v-flex>
  </v-layout>
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
