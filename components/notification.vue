<template>
  <v-menu
    v-if="logged"
    :nudge-width="350"
    max-width="350"
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
    <v-tabs>
      <v-tab
        right
        title="Ticket"
      >
        <v-icon
          class="primary--text"
        >
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
                {{ notification.date | date }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn
                icon
                class="primary--text"
                :to="`/profile/notification/${notification._id}`"
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
        <v-icon
          class="primary--text"
        >
          insert_chart
        </v-icon>
      </v-tab>
      <v-tab-item />
    </v-tabs>
    <v-card
      class="fixed-footer"
    >
      <v-btn
        v-if="notifications.length > 0"
        flat
        @click="readAllNotifications()"
      >
        Marcar todas como lidas
        <v-icon
          right
          class="primary--text"
        >
          details
        </v-icon>
      </v-btn>
      <v-btn
        flat
        to="/profile/notification"
      >
        Ver todas notificações
        <v-icon
          right
          class="primary--text"
        >
          search
        </v-icon>
      </v-btn>
    </v-card>
  </v-menu>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters({
    notifications: 'notification/getUnread',
    logged: 'auth/getLoggedIn',
    user: 'auth/getUser'
  }),
  async mounted() {
    if (this.user !== undefined && this.user._id !== undefined) {
      await this.$axios
        .post(`/notification/${this.user._id}`)
        .then(response => {
          this.$store.commit('notification/setNotifications', response.data)
        })
      await this.$axios
        .post(`/analyst/${this.user._id}/groups`)
        .then(response => {
          this.notificationGroups = response.data
        })
    }
  },
  methods: {
    readAllNotifications() {
      this.notifications.forEach(n => {
        this.$axios.post(`/notification/${n._id}/read`, {
          read: true
        })
      })
    }
  }
}
</script>

<style>
.fixed-footer {
  bottom: 0 !important;
  margin-top: auto !important;
  position: sticky !important;
}
</style>
