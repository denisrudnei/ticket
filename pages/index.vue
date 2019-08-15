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
import ListTicket from '@/components/ticket/list'
export default {
  components: {
    ListTicket
  },
  data() {
    return {
      tickets: []
    }
  }
}
</script>
