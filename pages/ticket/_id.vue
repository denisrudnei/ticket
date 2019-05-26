<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
      pa-2
    >
      <ticket-create
        :ticket="ticket"
        :readonly="false"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import TicketCreate from '@/components/ticket/create'

export default {
  components: {
    TicketCreate
  },
  data() {
    return {
      headers: [
        {
          text: 'Usuário',
          value: 'user'
        },
        {
          text: 'Data',
          value: 'date'
        },
        {
          text: 'Status',
          value: 'status'
        },
        {
          text: 'Grupo',
          value: 'group'
        }
      ]
    }
  },
  asyncData() {
    return {
      analysts: [],
      groups: [],
      status: [],
      categories: [],
      ticket: {
        actualUser: {
          _id: ''
        }
      }
    }
  },
  created() {
    this.update()
  },
  methods: {
    save() {
      const id = this.$router.currentRoute.params.id
      this.$axios.put(`/ticket/${id}`, this.ticket).then(() => {
        this.update()
      })
    },
    update() {
      const id = this.$router.currentRoute.params.id
      this.$axios.get(`/ticket/${id}`).then(result => {
        this.ticket = result.data
      })
      this.$axios.get('/analyst').then(result => {
        this.analysts = result.data
      })
      this.$axios.get('/group').then(result => {
        this.groups = result.data
      })
      this.$axios.get('/status').then(result => {
        this.status = result.data
      })
      this.$axios.get('/category').then(result => {
        this.categories = result.data
      })
    }
  }
}
</script>

<style>
</style>
