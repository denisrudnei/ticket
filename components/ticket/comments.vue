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
export default {
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      ticketData: {},
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
  computed: {
    ticket() {
      return Object.assign(this.ticketData, this.value)
    }
  }
}
</script>

<style>
</style>
