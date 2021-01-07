<template>
  <v-row>
    <v-col>
      <list-ticket @updatePagination="update()" />
    </v-col>
  </v-row>
</template>

<script>
import ListTicket from '@/components/ticket/list';
import search from '@/graphql/query/search/ticket';
import { mapGetters } from 'vuex';

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
    ...mapGetters({
      pagination: 'ticket/getPagination',
    }),
    user() {
      return this.$auth.user;
    },
  },
  created() {
    this.$store.commit('ticket/setQuery', {
      [this.type]: this.user.id,
    });
    this.update();
  },
  methods: {
    update() {
      this.$store.commit('ticket/setLoading', true);
      this.$apollo.query({
        query: search,
        variables: {
          page: parseInt(this.pagination.page, 10),
          sortBy: this.pagination.sortBy,
          descending: parseInt(this.pagination.descending, 10),
          limit: this.pagination.itemsPerPage,
          attributes: {
            [this.type]: this.user.id,
          },
        },
      }).then((response) => {
        const {
          docs, page, limit, total,
        } = response.data.Tickets;
        this.$store.commit('ticket/setTickets', docs);
        this.$store.commit('ticket/setPagination', {
          page,
          totalItems: total,
          itemsPerPage: limit,
        });
        this.$store.commit('ticket/setLoading', false);
      });
    },
  },
};
</script>

<style></style>
