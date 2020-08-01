<template>
  <v-row>
    <v-col cols="12">
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
  created() {
    this.$store.commit('ticket/setQuery', { page: 1 });
  },
};
</script>
