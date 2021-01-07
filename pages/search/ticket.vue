<template>
  <v-row>
    <v-col cols="12">
      <ticket-create
        search
        @input="search(ticket)"
      />
    </v-col>
    <v-col cols="12">
      <ticket-list @updatePagination="update" />
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';

import TicketCreate from '@/components/ticket/create';
import TicketList from '@/components/ticket/list';
import searchQuery from '@/graphql/query/ticket/search';
import ticketSearch from '@/graphql/query/search/ticket';

export default {
  components: {
    TicketCreate,
    TicketList,
  },
  middleware({ app, store }) {
    app.apolloProvider.defaultClient
      .query({
        query: searchQuery,
      })
      .then((response) => {
        store.commit('status/setStatus', response.data.status);
        store.commit('category/setCategories', response.data.category);
        store.commit('group/setGroups', response.data.group);
        store.commit('analyst/setAnalysts', response.data.analyst);
      });
  },
  data() {
    return {
      newTicket: {},
      data: null,
      list: [],
      headers: [
        {
          text: 'Analista',
          value: 'analyst',
        },
        {
          text: 'Grupo',
          value: 'Group',
        },
      ],
    };
  },
  computed: mapGetters({
    status: 'status/getStatus',
    group: 'group/getGroups',
    category: 'category/getCategories',
    openedBy: 'analyst/getAnalysts',
    ticket: 'ticket/getActualTicket',
    pagination: 'ticket/getPagination',
  }),
  watch: {
    $route(to, from) {
      this.data = this.$router.currentRoute.query;
    },
  },
  created() {
    this.$store.commit('ticket/resetActualTicket');
  },
  mounted() {
    this.data = this.$router.currentRoute.query;
  },
  methods: {
    update() {
      this.$apollo.query({
        query: ticketSearch,
        variables: {
          page: this.pagination.page,
          limit: this.pagination.itemsPerPage,
          attributes: this.newTicket,
        },
      }).then((response) => {
        const {
          docs, total, page, limit,
        } = response.data.Tickets;
        this.$store.commit('ticket/setTickets', docs);
        this.$store.commit('ticket/setPagination', {
          page: parseInt(page, 10),
          itemsPerPage: parseInt(limit, 10),
          totalItems: parseInt(total, 10),
        });
      });
    },
    search(ticket) {
      this.newTicket = {};
      Object.keys(ticket).forEach((k) => {
        if (
          ticket[k] !== undefined
          && Object.prototype.hasOwnProperty.call(ticket[k], 'id')
        ) {
          this.newTicket[k] = ticket[k].id;
        }
      });
      const fieldsToExclude = ['created', 'modified', 'resume', 'content'];
      fieldsToExclude.forEach((f) => {
        delete this.newTicket[f];
      });
      this.$router.push({
        query: this.newTicket,
      });
      this.update();
    },
  },
};
</script>

<style></style>
