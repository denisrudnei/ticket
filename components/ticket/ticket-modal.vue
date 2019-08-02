<template>
  <v-dialog
    v-model="showModal"
    scrollable
  >
    <v-layout row wrap>
      <v-flex xs12 pa-2>
        <ticket-list
          v-if="showModal"
          :url="`/search/`"
        />
      </v-flex>
    </v-layout>
  </v-dialog>
</template>

<script>
import TicketList from '@/components/ticket/list'
export default {
  components: {
    TicketList
  },
  computed: {
    showModal: {
      get() {
        return this.$store.getters['ticket/getModalList']
      },
      set(value) {
        this.$store.commit('ticket/setModalList', value)
      }
    }
  }
}
</script>

<style>
</style>
