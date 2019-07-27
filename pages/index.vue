<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
    >
      <list-ticket
        url="/ticket/"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import ListTicket from '@/components/ticket/list'
export default {
  components: {
    ListTicket
  },
  data() {
    return {
      tickets: []
    }
  },
  computed: mapGetters({
    user: 'auth/getUser'
  }),

  mounted() {
    this.$axios.post('/auth/mergeUser', this.$auth.user).then(response => {
      this.$store.commit('auth/mergeUser', response.data)
    })
  }
}
</script>
