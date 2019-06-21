<template>
  <v-layout row wrap>
    <v-flex xs12>
      <ticket-tree />
    </v-flex>
  </v-layout>
</template>

<script>
import TicketTree from '@/components/ticket/tree'
export default {
  components: {
    TicketTree
  }
}
</script>

<style>
</style>
