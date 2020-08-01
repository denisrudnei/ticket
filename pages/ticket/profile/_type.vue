<template>
  <v-row>
    <v-col>
      <list-ticket />
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';
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
  computed: mapGetters({
    user: 'auth/getUser',
  }),
  created() {
    this.$store.commit('ticket/setQuery', {
      [this.type]: this.user.id,
    });
  },
};
</script>

<style></style>
