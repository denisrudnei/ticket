<template>
  <ticket-create
    v-model="ticket"
    @input="create()"
  />
</template>

<script>
import TicketCreate from '@/components/ticket/create'

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
        .post('api/ticket', this.ticket)
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
