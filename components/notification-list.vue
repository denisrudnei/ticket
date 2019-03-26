<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
    >
      <v-list
        two-line
      >
        <v-list-tile
          v-for="notification in notifications"
          :key="notification._id"
        >
          <v-list-tile-content>
            <v-list-tile-title>
              {{ notification.content }}
            </v-list-tile-title>
            <v-list-tile-sub-title>
              {{ new Date(notification.date) | date }}
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-switch
              :value="notification.read"
              label="Lida?"
              @change="readNotification(notification)"
            />
            <v-btn
              icon
              :to="`/notification/${notification._id}`"
            >
              <v-icon>
                info
              </v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters({
    notifications: 'notification/getNotifications'
  }),
  methods: {
    readNotification(notification) {
      this.$axios
        .post(`api/notification/${notification._id}/read`, notification)
        .then(response => {
          this.$store.commit('notification/updateNotification', response.data)
          this.$toast.show('Lida', {
            duration: 1000
          })
        })
    }
  }
}
</script>

<style>
</style>
