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
      this.search(this.clean(this.ticket))
    },
    search(ticket) {
      this.$axios.post('api/search', ticket).then(result => {
        this.list = result.data
      })
    }
  }
}
</script>

<style>
</style>
