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
      <v-tab-item>
        <v-list>
          <v-list-item v-for="notification in notificationTicketsToEdit" :key="notification.ticket" @click="setActual(notification.ticket)">
            <v-list-item-content>
              {{ `${notification.user.name} atualizou um chamado que está em sua pilha de trabalho` }}
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-tab-item>
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
        {{ $t('see_all_notifications') }}
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
import ggl from 'graphql-tag'
import notificationList from '@/graphql/query/profile/notification/list.graphql'
export default {
  computed: {
    notificationTicketsToEdit() {
      return this.$store.getters[
        'notification/ticketsToEdit/getTicketsToEdit'
      ].map(ntf => {
        const userIndex = this.analysts.findIndex(a => {
          return a._id === ntf.user
        })
        const user = this.analysts[userIndex]
        return {
          ticket: ntf.ticket,
          user
        }
      })
    },
    ...mapGetters({
      analysts: 'analyst/getAnalysts',
      notifications: 'notification/getUnread',
      logged: 'auth/getLoggedIn',
      user: 'auth/getUser',
      groups: 'group/getGroups',
      ticketsToEdit: 'ticket/getTicketsToEdit'
    })
  },
  mounted() {
    if (this.user !== undefined && this.user._id !== undefined) {
      this.$apollo
        .query({
          query: ggl(notificationList)
        })
        .then(response => {
          this.$store.commit(
            'notification/setNotifications',
            response.data.notification
          )
        })
    }
  },
  methods: {
    readAllNotifications() {
      this.$axios.post(`/notification/readall`).then(response => {
        this.$store.commit('notification/setNotifications', response.data)
      })
    },
    setActual(ticketId) {
      const ticketIndex = this.ticketsToEdit.findIndex(t => {
        return t._id === ticketId
      })
      if (ticketIndex !== -1) {
        this.$store.commit(
          'ticket/setActualTicket',
          this.ticketsToEdit[ticketIndex]
        )
        this.$store.commit('ticket/setDialog', ticketId)
      } else {
        this.$store.commit(
          'notification/ticketsToEdit/removeNotification',
          ticketId
        )
      }
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
