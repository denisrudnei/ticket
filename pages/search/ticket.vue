<template>
  <v-row>
    <v-col cols="12">
      <ticket-create
        search
        @input="search(ticket)"
      />
    </v-col>
    <v-col cols="12">
      <ticket-list :url="'/search/'" />
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';

import TicketCreate from '@/components/ticket/create';
import TicketList from '@/components/ticket/list';
import searchQuery from '@/graphql/query/ticket/search';

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
    search(ticket) {
      const newTicket = {};
      Object.keys(ticket).forEach((k) => {
        if (
          ticket[k] !== undefined
          && Object.prototype.hasOwnProperty.call(ticket[k], 'id')
        ) {
          newTicket[k] = ticket[k].id;
        }
      });
      const fieldsToExclude = ['created', 'modified', 'resume', 'content'];
      fieldsToExclude.forEach((f) => {
        delete newTicket[f];
      });
      this.$router.push({
        query: newTicket,
      });
    },
  },
};
</script>

<style></style>
