export default {
  methods: {
    addTicketsToEdit(ticket) {
      this.$store.commit('ticket/setActualTicket', ticket)
      this.$store.commit('ticket/setDialog', ticket.id)
      this.$store.commit('ticket/addTicketsToEdit', ticket)
      this.$store.dispatch('ticket/findTicket', ticket.id)
    }
  }
}
