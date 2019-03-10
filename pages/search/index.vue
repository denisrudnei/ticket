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
        @input="search()"  
      />
    </v-flex>
    <v-flex
      xs12
    >
      <ticket-list
        :tickets="list"
      />
      <pre>
        {{ list }}
      </pre>
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
      this.$axios.post('api/search', this.data).then(result => {
        this.list = result.data
      })
    }
  },
  created() {
    this.data = this.$router.currentRoute.query
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
    search() {
      this.$axios.post('api/search', this.clean(this.ticket)).then(result => {
        this.list = result.data
      })
    }
  }
}
</script>

<style>
</style>
