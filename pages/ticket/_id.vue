<template>
  <v-layout>
    <v-flex
      xs12
      pa-2
    >
      <ticket-create
        :ticket="ticket"
        :readonly="true"
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
      if (this.$refs.form.validate()) {
        this.$axios.put(`api/ticket/${id}`, this.ticket).then(() => {
          this.update()
        })
      }
    },
    update() {
      const id = this.$router.currentRoute.params.id
      this.$axios.get(`api/ticket/${id}`).then(result => {
        this.ticket = result.data
      })
      this.$axios.get('api/analyst').then(result => {
        this.analysts = result.data
      })
      this.$axios.get('api/group').then(result => {
        this.groups = result.data
      })
      this.$axios.get('api/status').then(result => {
        this.status = result.data
      })
      this.$axios.get('api/category').then(result => {
        this.categories = result.data
      })
    }
  }
}
</script>

<style>
</style>
