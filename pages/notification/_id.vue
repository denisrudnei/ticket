<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
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
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      notification: null
    }
  },
  async mounted() {
    const id = this.$router.currentRoute.params.id
    await this.$axios.get(`api/notification/${id}`).then(response => {
      this.notification = response.data
    })
  },
  methods: {
    read() {
      const id = this.notification._id
      this.$axios
        .post(`api/notification/${id}/read`, this.notification)
        .then(response => {
          this.$store.commit('notification/updateNotification', response.data)
        })
    }
  }
}
</script>

<style>
</style>
