<template>
  <v-row>
    <v-col
      cols="12"
    >
      <list-ticket
        url="/ticket/"
      />
    </v-col>
  </v-row>
</template>

<script>
import ListTicket from '@/components/ticket/list'
export default {
  components: {
    ListTicket
  }
}
</script>
