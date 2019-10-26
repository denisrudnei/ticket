<template>
  <ticket-create
    v-model="ticket"
    @input="create()"
  />
</template>

<script>
import TicketCreate from '@/components/ticket/create'
import create from '@/graphql/mutation/ticket/create.graphql'
export default {
  components: {
    TicketCreate
  },
  data() {
    return {
      ticket: {}
    }
  },
  methods: {
    create() {
      this.$axios
        .post('/graphql', {
          query: create,
          variables: {
            ticket: {
              actualUser: this.ticket.actualUser._id,
              affectedUser: this.ticket.affectedUser._id,
              resume: this.ticket.resume,
              content: this.ticket.content,
              group: this.ticket.group._id,
              category: this.ticket.category._id,
              priority: this.ticket.priority._id,
              status: this.ticket.status._id
            }
          }
        })
        .then(() => {
          this.$router.push('/')
        })
        .catch(() => {
          this.$toast.error(`Erro ao criar ticket`, {
            duration: 5000
          })
        })
    }
  }
}
</script>

<style>
</style>
