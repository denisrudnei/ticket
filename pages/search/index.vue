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
        @input="search(ticket)"  
      />
    </v-flex>
    <v-flex
      xs12
    >
      <ticket-list
        :url="'/search/'"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import TicketCreate from '@/components/ticket/create'
import TicketList from '@/components/ticket/list'
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
    group: 'group/getGroups',
    category: 'category/getCategories',
    openedBy: 'analyst/getAnalysts'
  }),
  watch: {
    $route(to, from) {
      this.data = this.$router.currentRoute.query
    }
  },
  async mounted() {
    await this.$axios.get('/status').then(response => {
      this.$store.commit('status/setStatus', response.data)
    })
    await this.$axios.get('/category').then(response => {
      this.$store.commit('category/setCategories', response.data)
    })
    await this.$axios.get('/group').then(response => {
      this.$store.commit('group/setGroups', response.data)
    })
    await this.$axios.get('/analyst').then(reponse => {
      this.$store.commit('analyst/setAnalysts', reponse.data)
    })
    this.data = this.$router.currentRoute.query
  },
  methods: {
    search(ticket) {
      const newTicket = {}
      Object.keys(ticket).forEach(k => {
        if (
          ticket[k] !== undefined &&
          Object.prototype.hasOwnProperty.call(ticket[k], '_id')
        ) {
          newTicket[k] = ticket[k]._id
        } else {
          newTicket[k] = ticket[k]
        }
      })
      const fieldsToExclude = ['created', 'modified', 'resume', 'content']
      fieldsToExclude.forEach(f => {
        delete newTicket[f]
      })
      this.$router.push({
        query: newTicket
      })
    }
  }
}
</script>

<style>
</style>
