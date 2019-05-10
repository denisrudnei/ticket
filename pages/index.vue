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

export default {
  components: {
    ListTicket
  },
  data() {
    return {
      tickets: []
    }
  },
  watch: {
    $route(to, from) {
      this.getTicket()
    }
  },
  created() {
    this.getTicket()
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
