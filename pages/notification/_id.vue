<template>
  <v-layout
    row
    wrap
  >
    {{ notification }}
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
    this.$axios.get(`api/notification/${id}`).then(response => {
      this.notification = response.data
    })
  }
}
</script>

<style>
</style>
