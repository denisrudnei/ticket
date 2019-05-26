<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
      pa-2
    >
      <v-data-table
        :items="ticket.comments"
        :headers="headers"
      >
        <template
          v-slot:items="{ item }"
        >
          <td>{{ item.user.name }}</td>
          <td>{{ item.date | date }}</td>
          <td>{{ item.content }}</td>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      headers: [
        {
          text: 'Nome',
          value: 'name'
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
