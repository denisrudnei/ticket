<template>
  <v-row>
    <v-col
      cols="12"
      pa-3
    >
      <v-data-table
        :items="actualTicket.children"
        :headers="headers"
      >
        <template
          v-slot:item.ticketNumber="{ item }"
        >
          {{ item.ticketNumber }}
        </template>
        <template v-slot:item.group="{ item }">
          {{ item.group.name }}
        </template>
        <template v-slot:item.status="{ item }">
          {{ item.status.name }}
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    headers() {
      return [
        {
          text: this.$t('number_of_ticket'),
          value: 'ticketNumber'
        },
        {
          text: this.$t('status'),
          value: 'status'
        },
        {
          text: this.$t('group'),
          value: 'group'
        }
      ]
    },
    ...mapGetters({
      actualTicket: 'ticket/getActualTicket'
    })
  }
}
</script>

<style>
</style>
