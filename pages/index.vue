<template>
  <v-row>
    <v-col cols="12">
      <list-ticket
        @updateAttributes="updateAttributes"
        @updatePagination="updatePagination"
      />
    </v-col>
  </v-row>
</template>

<script>
import ListTicket from '@/components/ticket/list';
import transferToGroup from '@/graphql/mutation/ticket/transferToGroup';
import ticketSearch from '@/graphql/query/search/ticket';
import { mapGetters } from 'vuex';

export default {
  components: {
    ListTicket,
  },
  computed: {
    query: {
      get() {
        if (this.modal) return this.$store.getters['ticket/getModalQuery'];
        return this.$store.getters['ticket/getQuery'];
      },
      set(value) {
        this.$store.commit('ticket/setQuery', value);
      },
    },
    ...mapGetters({
      pagination: 'ticket/getPagination',
      attributes: 'ticket/getAttributes',
    }),
  },
  methods: {
    updatePagination() {
      this.update();
    },
    updateAttributes(attributes) {
      this.update();
    },
    update() {
      this.$store.commit('ticket/setLoading', true);
      this.$apollo
        .query({
          query: ticketSearch,
          fetchPolicy: 'network-only',
          variables: {
            sortBy: this.pagination.sortBy,
            page: parseInt(this.pagination.page, 10) || 1,
            limit: parseInt(this.pagination.limit, 10) || 10,
            descending: parseInt(this.pagination.descending, 10) || -1,
            attributes: this.attributes,
          },
        })
        .then((response) => {
          const {
            docs, total, limit, page,
          } = response.data.Tickets;

          this.$store.commit('ticket/setTickets', docs);
          this.$store.commit('ticket/setPagination', {
            totalItems: parseInt(total, 10),
            page: parseInt(page, 10),
            itemsPerPage: parseInt(limit, 10),
          });
          this.$store.commit('ticket/setLoading', false);
        });
    },
  },
};
</script>
