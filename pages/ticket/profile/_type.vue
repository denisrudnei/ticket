<template>
  <v-row>
    <v-col>
      <list-ticket />
    </v-col>
  </v-row>
</template>

<script>
import ListTicket from '@/components/ticket/list';

export default {
  components: {
    ListTicket,
  },
  asyncData({ params }) {
    return {
      type: params.type,
    };
  },
  computed: {
    user() {
      return this.$auth.user;
    },
  },
  created() {
    this.$store.commit('ticket/setQuery', {
      [this.type]: this.user.id,
    });
  },
};
</script>

<style></style>
