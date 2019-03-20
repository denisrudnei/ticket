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
    group: 'group/getGroups',
    category: 'category/getCategories'
  }),
  watch: {
    $route(to, from) {
      this.data = this.$router.currentRoute.query
      this.search(this.convertQueryString(this.data))
    }
  },
  async mounted() {
    await this.$axios.get('api/status').then(response => {
      this.$store.commit('status/setStatus', response.data)
    })
    await this.$axios.get('api/category').then(response => {
      this.$store.commit('category/setCategories', response.data)
    })
    await this.$axios.get('api/group').then(response => {
      this.$store.commit('group/setGroups', response.data)
    })
    await this.$axios.get('api/analyst').then(reponse => {
      this.$store.commit('analyst/setAnalysts', reponse.data)
    })
    this.data = this.$router.currentRoute.query
    this.search(this.convertQueryString(this.data))
  },
  methods: {
    convertQueryString(queryString) {
      const search = {}
      Object.keys(queryString).forEach(k => {
        const [field, name] = k.split('.')
        const value = this[field].filter(f => {
          return f[name] === Object.values(queryString)[0]
        })[0]._id
        search[field] = value
      })
      return search
    },
    search(ticket) {
      const newTicket = {}
      Object.keys(ticket).forEach(k => {
        if (ticket[k] !== undefined && ticket[k].hasOwnProperty('_id')) {
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
        this.$store.commit('ticket/setSearch', response.data)
      })
    }
  }
}
</script>

<style>
</style>
