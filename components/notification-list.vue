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
          :key="notification.id"
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
                  :to="`/profile/notification/${notification.id}`"
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
                  :input-value="notification.read.map(r => r.id)"
                  :value="user.id.toString()"
                  :label="$t('read')"
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
import { mapGetters } from 'vuex'
import readNotification from '@/mixins/readNotification'
export default {
  mixins: [readNotification],
  props: {
    notifications: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: mapGetters({
    user: 'auth/getUser'
  })
}
</script>

<style>
</style>
