<template>
  <v-row>
    <v-col
      cols="12"
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
        </v-card-text>
        <v-card-actions>
          <v-switch
            v-model="notification.read"
            label="Lido"
            @change="read()"
          />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  watchQuery: true,
  asyncData({ $axios, params }) {
    const id = params.id
    return $axios.get(`/notification/${id}`).then(response => {
      return {
        notification: response.data
      }
    })
  },
  methods: {
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
