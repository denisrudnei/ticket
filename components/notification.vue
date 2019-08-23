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
        text
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
    <v-tabs show-arrows>
      <v-tab
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
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                pa-3
              >
                Nenhuma notificação
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-list
          v-if="notifications.length > 0"
          two-line
        >
          <v-list-item
            v-for="notification in notifications"
            :key="notification._id"
            :to="`/profile/notification/${notification._id}`"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ notification.content }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ notification.date | date }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                icon
                class="primary--text"
                :to="`/profile/notification/${notification._id}`"
              >
                <v-icon>
                  info
                </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-tab-item>
      <v-tab>
        <v-icon
          class="primary--text"
        >
          group
        </v-icon>
      </v-tab>
      <v-tab-item />
    </v-tabs>
    <v-card
      class="fixed-footer"
    >
      <v-btn
        v-if="notifications.length > 0"
        tile
        text
        block
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
        tile
        block
        to="/profile/notification/all"
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
    user: 'auth/getUser',
    groups: 'group/getGroups'
  }),
  mounted() {
    if (this.user !== undefined && this.user._id !== undefined) {
      this.$axios.post('/notification/').then(response => {
        this.$store.commit('notification/setNotifications', response.data)
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
