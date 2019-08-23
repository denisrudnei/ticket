<template>
  <v-row>
    <v-col
      cols="12"
      pa-3
    >
      <v-data-table
        :items="ticket.comments"
        :headers="headers"
      >
        <template
          v-slot:item.user="{ item }"
        >
          {{ item.user.name }}
        </template>
        <template v-slot:item.date="{ item }">
          {{ item.date | date }}
        </template>
        <template v-slot:item.content="{ item }">
          {{ item.content }}
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      headers: [
        {
          text: 'Nome',
          value: 'user'
        },
        {
          text: 'Data',
          value: 'date'
        },
        {
          text: 'Comentário',
          value: 'content'
        }
      ]
    }
  },
  computed: mapGetters({
    ticket: 'ticket/getActualTicket'
  })
}
</script>

<style>
</style>
