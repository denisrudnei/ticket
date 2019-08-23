<template>
  <v-row>
    <v-col
      cols="8"
      offset="2"
      pa-3
    >
      <h2>Processando login...</h2>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import afterLogin from '@/mixins/afterLogin'
export default {
  mixins: [afterLogin],
  computed: mapGetters({
    user: 'auth/getUser'
  }),
  async mounted() {
    const token = this.$route.hash
      .split('#')[1]
      .split('&')[0]
      .split('=')[1]
    const { data } = await this.$axios.get(
      'https://bm-dns.auth0.com/userinfo',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    this.$axios.post('/auth/mergeUser', data).then(() => {
      this.$store.commit('auth/mergeUser', data)
      this.processInfo()
    })
  }
}
</script>

<style>
</style>
