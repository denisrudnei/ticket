<template>
  <v-row>
    <v-col
      cols="12"
    >
      <v-list
        two-line
      >
        <v-list-item
          v-for="notification in notifications"
          :key="notification._id"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ notification.content }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ new Date(notification.date) | date }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-row>
              <v-col
                pa-1
              >
                <v-btn
                  icon
                  :to="`/profile/notification/${notification._id}`"
                >
                  <v-icon>
                    info
                  </v-icon>
                </v-btn>
              </v-col>
              <v-col
                pa-1
              >
                <v-switch
                  :input-value="notification.read"
                  label="Lida?"
                  @change="readNotification(notification)"
                />
              </v-col>
            </v-row>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    notifications: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    readNotification(notification) {
      this.$axios
        .post(`/notification/${notification._id}/read`, {
          ...notification,
          read: !notification.read
        })
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
