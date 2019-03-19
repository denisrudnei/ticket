<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
    >
      <ticket-create
        v-model="ticket"
        search
        @input="searchFiltred()"  
      />
    </v-flex>
    <v-flex
      xs12
    >
      <ticket-list
        :tickets="list"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import TicketCreate from '@/components/ticket/create'
import TicketList from '@/components/ticket/list'
import { mapGetters } from 'vuex'

export default {
  components: {
    TicketCreate,
    TicketList
  },
  data() {
    return {
      data: null,
      list: [],
      ticket: {},
      headers: [
        {
          text: 'Analista',
          value: 'analyst'
        },
        {
          text: 'Grupo',
          value: 'Group'
        }
      ]
    }
  },
  computed: mapGetters({
    status: 'status/getStatus',
    groups: 'group/getGroups'
  }),
  watch: {
    $route(to, from) {
      this.data = this.$router.currentRoute.query
      this.search(this.data)
    }
  },
  created() {
    this.data = this.$router.currentRoute.query
    this.search(this.data)
  },
  methods: {
    clean(obj) {
      Object.keys(obj).forEach(key => {
        if (obj[key] === '') {
          delete obj[key]
        }
      })
      return obj
    },
    searchFiltred() {
      this.search(this.ticket)
    },
    search(ticket) {
      const newTicket = {}
      Object.keys(ticket).forEach(k => {
        if (ticket[k].hasOwnProperty('_id')) {
          newTicket[k] = ticket[k]._id
        } else {
          newTicket[k] = ticket[k]
        }
      })
      const fieldsToExclude = ['created', 'modified', 'resume', 'content']
      fieldsToExclude.forEach(f => {
        delete newTicket[f]
      })
      this.$axios.post('api/search', newTicket).then(response => {
        this.$store.commit('ticket/setTickets', response.data)
        // this.list = result.data
      })
    }
  }
}
</script>

<style>
</style>
