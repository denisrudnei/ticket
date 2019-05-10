<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
    >
      <list-ticket
        :tickets="tickets"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import ListTicket from '@/components/ticket/list'
import { mapGetters } from 'vuex'

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
    user: 'auth/getUser',
    logged: 'auth/getLoggedIn'
  }),
  watch: {
    $route(to, from) {
      this.getTicket()
    }
  },
  methods: {
    getTicket() {
      this.$axios.get('/ticket').then(result => {
        this.tickets = result.data
      })
    }
  }
}
</script>
