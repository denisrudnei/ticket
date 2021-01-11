<template>
  <v-row>
    <v-col>
      <ticket-list @updatePagination="update()" />
    </v-col>
  </v-row>
</template>

<script>
import TicketList from '@/components/ticket/list';
import ticketSearch from '@/graphql/query/search/ticket';
import { mapGetters } from 'vuex';

export default {
  components: {
    TicketList,
  },
  computed: mapGetters({
    pagination: 'ticket/getPagination',
  }),
  watch: {
    $route() {
      this.update();
    },
  },
  watchQuery: true,
  created() {
    this.update();
  },
  methods: {
    update() {
      const { type, id } = this.$route.params;
      const attributes = {
        [type]: id,
      };
      this.$apollo.query({
        query: ticketSearch,
        variables: {
          orderBy: this.pagination.orderBy,
          descending: this.pagination.descending,
          page: this.pagination.page,
          limit: this.pagination.itemsPerPage,
          attributes,
        },
      }).then((response) => {
        const {
          docs, page, limit, total,
        } = response.data.Tickets;
        this.$store.commit('ticket/setTickets', docs);
        this.$store.commit('ticket/setPagination', {
          page: parseInt(page, 10),
          itemsPerPage: parseInt(limit, 10),
          totalItems: parseInt(total, 10),
        });
      });
    },
  },
};
</script>

<style>

</style>
