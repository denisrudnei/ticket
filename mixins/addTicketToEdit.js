export default {
  methods: {
    addTicketsToEdit(ticket) {
      this.$store.commit('ticket/setActualTicket', ticket)
      this.$store.commit('ticket/setDialog', ticket._id)
      this.$store.commit('ticket/addTicketsToEdit', ticket)
      this.$store.dispatch('ticket/findTicket', ticket._id)
    }
  }
}
