<template>
  <v-row>
    <v-col>
      <v-text-field
        v-model="search"
        filled
        :label="$t('search')"
        prepend-icon="search"
      />
    </v-col>
    <v-col cols="12">
      <v-row>
        <v-col
          v-for="ticket in tickets"
          :key="ticket.id"
          cols="12"
          md="4"
        >
          <v-card
            tile
            :color="color(ticket)"
            class="white--text"
            dark
          >
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <nuxt-link
                    :to="`/client/ticket/view/${ticket.id}`"
                    tag="span"
                  >
                    <v-card-title class="text-center">
                      <p>{{ ticket.resume }}</p>
                    </v-card-title>
                  </nuxt-link>
                </v-col>
                <v-col> {{ $t('number_of_ticket') }}: {{ ticket.id }} </v-col>
                <v-col cols="12">
                  <v-progress-linear
                    striped
                    height="15"
                    :value="ticket.slaPencentage"
                    color="black"
                  >
                    {{ Math.round(ticket.slaPercentage) }} %
                  </v-progress-linear>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    readonly
                    :label="$t('status')"
                    :value="ticket.status.name"
                    filled
                  />
                  <v-text-field
                    readonly
                    :label="$t('actual_group')"
                    :value="ticket.group.name"
                    filled
                  />
                  <v-text-field
                    filled
                    :value="ticket.created | date"
                    :label="$t('creation_date')"
                  />
                  <v-text-field
                    filled
                    :value="ticket.modified | date"
                    :label="$t('modified_date')"
                  />
                </v-col>
                <v-col cols="12">
                  <v-btn
                    :to="`/client/ticket/view/${ticket.id}`"
                    block
                    tile
                  >
                    {{ $t('see_details') }}
                    <v-icon right>
                      search
                    </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-pagination
      v-model="page"
      :value="page"
      :total-visible="10"
      :length="pages"
    />
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';
import ggl from 'graphql-tag';
import listTicket from '@/graphql/query/client/ticket/searchTicket.graphql';

export default {
  layout: 'client',
  filters: {
    limit(value) {
      return value.substr(0, 100);
    },
  },
  data() {
    return {
      search: '',
      ticketsData: [],
      page: 1,
      pages: 0,
    };
  },
  computed: {
    ...mapGetters({
      user: 'auth/getUser',
    }),
    tickets() {
      return this.ticketsData
        .filter((ticket) => ticket.resume.toLowerCase().includes(this.search.toLowerCase()));
    },
  },
  watch: {
    page(value) {
      this.getTickets(value);
    },
  },
  mounted() {
    this.getTickets();
  },
  methods: {
    color(ticket) {
      if (ticket.slaPercentage <= 90) return 'green';
      if (ticket.slaPercentage >= 100) return 'red';
      return 'orange';
    },
    getTickets(page) {
      this.$apollo
        .query({
          query: ggl(listTicket),
          variables: {
            page: parseInt(page, 10) || 1,
            limit: 9,
            attributes: {
              openedBy: this.user.id,
            },
          },
        })
        .then((response) => {
          this.pages = response.data.ticket.pages;
          this.ticketsData = response.data.ticket.docs;
        });
    },
  },
};
</script>

<style scoped>
p {
  word-break: break-word !important;
}
</style>
