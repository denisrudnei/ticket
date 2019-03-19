<template>
  <v-menu
    v-if="logged"
    :nudge-width="350"
    max-height="40vh"
    offset-y
    :close-on-content-click="false"
    top
    class="white"
  >
    <template
      v-slot:activator="{ on }"
    >
      <v-btn
        icon
        flat
        v-on="on"
      >
        <v-badge>
          <template
            v-slot:badge
          >
            <span>{{ notifications.length }}</span>
          </template>
          <v-icon
            class="white--text"
          >
            notifications
          </v-icon>
        </v-badge>
      </v-btn>
    </template>
    <v-card>
      <v-btn
        v-if="notifications.length > 0"
        block
        @click="readAllNotifications()"
      >
        Marcar todas como lidas
      </v-btn>
    </v-card>
    <v-tabs>
      <v-tab
        right
        title="Ticket"
      >
        <v-icon>
          work
        </v-icon>
      </v-tab>
      <v-tab-item>
        <v-card
          v-if="notifications.length === 0"
        >
          <v-layout
            row
            wrap
          >
            <v-flex
              xs12
              pa-2
            >
              Nenhuma notificação
            </v-flex>
          </v-layout>
        </v-card>
        <v-list
          v-if="notifications.length > 0"
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
      </v-tab-item>
      <v-tab>
        Teste
      </v-tab>
      <v-tab-item />
    </v-tabs>
  </v-menu>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters({
    notifications: 'notification/getUnread',
    logged: 'auth/getLoggedIn'
  }),
  methods: {
    readAllNotifications() {
      this.notifications.forEach(n => {
        this.$axios.post(`api/notification/${n._id}/read`)
      })
    }
  }
}
</script>

<style>
</style>
