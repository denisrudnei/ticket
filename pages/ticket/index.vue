<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
      pa-2
    >
      <v-text-field
        v-model="search"
        box
        placeholder="Buscar"
      />
    </v-flex>
    <v-flex xs12>
      <list-ticket
        :tickets="tickets"
        :search="search"
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
      search: '',
      tickets: []
    }
  },
  adyncData() {
    return {
      tickets: []
    }
  }
}
</script>
<style>
</style>
