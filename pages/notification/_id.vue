<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
      pa-3
    >
      <v-card>
        <v-card-title>
          {{ notification.content }}
        </v-card-title>
        <v-card-actions>
          <v-switch
            v-model="notification.read"
            readonly
            label="Lido"
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
      notification: {}
    }
  },
  created() {
    const id = this.$router.currentRoute.params.id
    this.$axios.post(`api/notification/${id}/read`).then(response => {
      this.notification = response.data
    })
  }
}
</script>

<style>
</style>
