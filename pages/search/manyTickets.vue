<template>
  <v-row>
    <v-col cols="4">
      <v-textarea
        v-model="ticketsText"
        filled
        :label="$t('many_tickets_in_list')"
        append-icon="add"
        @click:append="addOneNumber(ticketsText)"
        @keyup="update"
      />
    </v-col>
    <v-col cols="8">
      <v-card>
        <v-card-title>
          {{ $t('tickets_to_search') }}
        </v-card-title>
        <v-card-text>
          <template v-for="ticket in ticketsNumbers">
            <v-chip
              :key="ticket"
              label
              class="ma-2"
              color="primary"
              text-color="white"
              close
              @click:close="removeNumber(ticket)"
            >
              <v-icon class="white--text">
                bolt
              </v-icon>
              {{ ticket }}
            </v-chip>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-btn
            v-if="ticketsNumbers.length > 0"
            class="primary white--text"
            @click="ticketsNumbers = []"
          >
            {{ $t('remove_all') }}
            <v-icon right>
              remove
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-btn
        class="primary white--text"
        @click="search"
      >
        {{ $t('search') }}
        <v-icon right>
          search
        </v-icon>
      </v-btn>
    </v-col>
    <v-col>
      <ticket-list
        @updatePagination="search"
      />
    </v-col>
  </v-row>
</template>

<script>
import TicketList from '@/components/ticket/list';
import { SearchByIds } from '@/graphql/query/search/SearchByIds';
import { mapGetters } from 'vuex';

export default {
  components: {
    TicketList,
  },
  data() {
    return {
      ticketsText: '',
      ticketsNumbers: [],
    };
  },
  computed: mapGetters({
    query: 'ticket/getQuery',
    pagination: 'ticket/getPagination',
  }),
  methods: {
    update(evt) {
      this.ticketsText = this.ticketsText.replace(/[^\d|,| |\n]/g, '');
      if (evt.key === 'Enter') {
        const numbers = Array.from(
          new Set(
            this.ticketsText.split(/[^\d]/).filter((number) => !Number.isNaN(parseInt(number, 10))),
          ),
        );
        this.ticketsNumbers = Array.from(
          new Set([...this.ticketsNumbers, ...numbers]),
        );
        this.ticketsText = '';
      }
    },
    search() {
      const {
        page, itemsPerPage, sortBy, descending,
      } = this.pagination;
      this.$apollo.query({
        query: SearchByIds,
        variables: {
          ids: this.ticketsNumbers.map((n) => parseInt(n, 10)),
          page,
          limit: itemsPerPage,
          descending,
          sortBy,
        },
      }).then((response) => {
        const { data } = response;
        const {
          page, pages, limit, total, docs,
        } = data.SearchByIds;
        this.$store.commit('ticket/setQuery', {
          ...this.query,
          page,
          pages,
          limit,
          total,
        });
        this.$store.commit('ticket/setTickets', docs);
        this.$store.commit('ticket/setPagination', {
          page: parseInt(page, 10),
          totalItems: parseInt(total, 10),
        });
      });
    },
    removeNumber(value) {
      this.ticketsNumbers = this.ticketsNumbers.filter((number) => number !== value);
    },
  },
};
</script>

<style></style>
