<template>
  <ticket-create v-model="ticket" @input="create()" />
</template>

<script>
import TicketCreate from '@/components/ticket/create';
import create from '@/graphql/mutation/ticket/create.graphql';
import ggl from 'graphql-tag';

export default {
  components: {
    TicketCreate,
  },
  data() {
    return {
      ticket: {},
    };
  },
  created() {
    this.$store.commit('ticket/resetActualTicket');
  },
  methods: {
    create() {
      this.$apollo
        .mutate({
          mutation: ggl(create),
          variables: {
            ticket: {
              actualUser: this.ticket.actualUser.id,
              affectedUser: this.ticket.affectedUser.id,
              address: this.ticket.address.id,
              resume: this.ticket.resume,
              content: this.ticket.content,
              group: this.ticket.group.id,
              category: this.ticket.category.id,
              priority: this.ticket.priority.id,
              status: this.ticket.status.id,
            },
          },
        })
        .then(() => {
          this.$router.push('/');
        })
        .catch(() => {
          this.$toast.error('Erro ao criar ticket', {
            duration: 5000,
          });
        });
    },
  },
};
</script>

<style></style>
