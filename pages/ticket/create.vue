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
      this.$axios.post('api/ticket', this.ticket).then(
        () => {
          this.$router.push('/')
        },
        err => {
          // eslint-disable-next-line
          console.log(err)
        }
      )
    }
  }
}
</script>

<style>
</style>
