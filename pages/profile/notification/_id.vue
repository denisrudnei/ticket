<template>
  <v-row>
    <v-col
      cols="11"
      pa-3
    >
      <v-card
        v-if="notification !== null"
      >
        <v-card-title>
          {{ notification.content }}
        </v-card-title>
        <v-card-text>
          <h4>Emitido por: {{ notification.from.name }}</h4>
          <sub>{{ notification.date | date }}</sub>
          <h4>
            {{ notification | numberOfPeople }}
          </h4>
        </v-card-text>
        <v-card-actions>
          <v-switch
            v-model="notification.read"
            :value="user._id"
            label="Lido"
            @change="read()"
          />
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="1">
      <v-row>
        <v-btn
          outlined
          :disabled="prev(notification) === undefined"
          fab
          color="primary"
          icon
          @click="goTo(prev(notification))"
        >
          <v-icon>
            keyboard_arrow_up
          </v-icon>
        </v-btn>
      </v-row>
      <br>
      <v-row>
        <v-btn
          outlined
          :disabled="next(notification) === undefined"
          fab
          color="primary"
          icon
          @click="goTo(next(notification))"
        >
          <v-icon>
            keyboard_arrow_down
          </v-icon>
        </v-btn>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  watchQuery: true,
  filters: {
    numberOfPeople(notification) {
      const size = notification.to.length
      if (size === 1) return 'Somente você recebeu essa notificação'
      if (size === 2)
        return 'Você e mais uma outra pessoa receberam essa notificação'
      if (size > 2) return `${size} pessoas receberam a notificação`
    }
  },
  asyncData({ $axios, params }) {
    const id = params.id
    return $axios.get(`/notification/${id}`).then(response => {
      return {
        notification: response.data
      }
    })
  },
  computed: mapGetters({
    user: 'auth/getUser',
    notifications: 'notification/getNotifications'
  }),
  methods: {
    prev(notification) {
      const index = this.notifications.findIndex(ntf => {
        return ntf._id === notification._id
      })
      return this.notifications[index - 1]
    },
    next(notification) {
      const index = this.notifications.findIndex(ntf => {
        return ntf._id === notification._id
      })
      return this.notifications[index + 1]
    },
    goTo(notification) {
      this.$router.push(`/profile/notification/${notification._id}`)
    },
    read() {
      const id = this.notification._id
      this.$axios
        .post(`/notification/${id}/read`, this.notification)
        .then(response => {
          this.$store.commit('notification/updateNotification', response.data)
        })
    }
  }
}
</script>

<style>
</style>
