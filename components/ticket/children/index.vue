<template>
  <v-row>
    <v-col cols="12">
      <v-btn
        class="primary white--text"
        @click="dialog = !dialog"
      >
        <v-icon>add</v-icon>
        {{ $t('add_children') }}
      </v-btn>
      <v-dialog
        v-model="dialog"
        scrollable
      >
        <v-card>
          <v-toolbar color="primary white--text">
            <v-toolbar-items>
              <v-btn
                class="primary white--text"
                icon
                @click="dialog = !dialog"
              >
                <v-icon>
                  close
                </v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-stepper v-model="step">
                  <v-stepper-header>
                    <v-stepper-step
                      :complete="step > 1"
                      :step="1"
                      @click="step = 1"
                    >
                      {{ $t('search_ticket') }}
                    </v-stepper-step>
                    <v-divider />
                    <v-stepper-step
                      :step="2"
                      :complete="step == 2"
                    >
                      {{ $t('select_ticket') }}
                    </v-stepper-step>
                  </v-stepper-header>
                  <v-stepper-content step="1">
                    <create
                      name="TicketCreate"
                      search
                      @input="setTicketToSearch"
                    />
                  </v-stepper-content>
                  <v-stepper-content step="2">
                    <list
                      v-model="tickets"
                      @input="addChildren"
                      @updatePagination="search"
                    />
                  </v-stepper-content>
                </v-stepper>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-col>
    <v-col
      cols="12"
      pa-3
    >
      <v-data-table
        :items="actualTicket.children"
        :headers="headers"
      >
        <template #item.id="{ item }">
          {{ item.id }}
        </template>
        <template #item.resume="{ item }">
          {{ item.resume }}
        </template>
        <template #item.status="{ item }">
          {{ item.status.name }}
        </template>
        <template #item.group="{ item }">
          {{ item.group.name }}
        </template>
        <template #item.category="{ item }">
          {{ item.category.fullName }}
        </template>
        <template #item.created="{ item }">
          {{ item.created | date }}
        </template>
        <template #item.modified="{ item }">
          {{ item.modified | date }}
        </template>
        <template #item.actions="{ item }">
          <v-btn
            class="red white--text"
            icon
            @click="removeChildren(item)"
          >
            <v-icon>
              delete
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';
import list from '@/components/ticket/children/search/list';
import search from '@/graphql/query/search/ticket';
import addChildren from '@/graphql/mutation/ticket/addChildren';
import removeChildren from '@/graphql/mutation/ticket/removeChildren';
import create from '../create';

export default {
  name: 'Children',
  components: {
    list,
    create,
  },
  data() {
    return {
      dialog: false,
      step: 1,
      tickets: [],
      ticket: {},
    };
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t('actions'),
          value: 'actions',
        },
        {
          text: this.$t('number_of_ticket'),
          value: 'id',
        },
        {
          text: this.$t('status'),
          value: 'status',
        },
        {
          text: this.$t('group'),
          value: 'group',
        },
        {
          text: this.$t('resume'),
          value: 'resume',
        },
        {
          text: this.$t('status'),
          value: 'status',
        },
        {
          text: this.$t('group'),
          value: 'group',
        },
        {
          text: this.$t('category'),
          value: 'category',
        },
        {
          text: this.$t('creation_date'),
          value: 'created',
        },
        {
          text: this.$t('modified_date'),
          value: 'modified',
        },
      ];
    },
    ...mapGetters({
      actualTicket: 'ticket/getActualTicket',
      pagination: 'ticket/getPagination',
    }),
  },
  created() {
    this.$options.components.create = create;
  },
  methods: {
    setTicketToSearch(ticket) {
      this.ticket = ticket;
      this.search();
    },
    search() {
      const newTicket = {};
      Object.keys(this.ticket).forEach((k) => {
        if (
          this.ticket[k] !== undefined
          && Object.prototype.hasOwnProperty.call(this.ticket[k], 'id')
        ) {
          newTicket[k] = this.ticket[k].id;
        }
      });
      const fieldsToExclude = ['CreateTicketd', 'modified', 'resume', 'content'];
      fieldsToExclude.forEach((f) => {
        delete newTicket[f];
      });
      this.$apollo
        .query({
          query: search,
          variables: {
            attributes: newTicket,
            page: this.pagination.page,
            limit: this.pagination.itemsPerPage,
            orderBy: this.pagination.orderBy,
            descending: this.pagination.descending,
          },
        })
        .then((response) => {
          const {
            docs, limit, page, total,
          } = response.data.Tickets;
          this.tickets = docs;
          this.step = 2;
          this.$store.commit('ticket/setPagination', {
            orderBy: this.pagination.orderBy,
            descending: this.pagination.descending,
            page,
            itemsPerPage: limit,
            totalItems: total,
          });
        });
    },
    addChildren(children) {
      this.dialog = false;
      this.$store.commit('ticket/addChildren', children);
      this.$apollo
        .mutate({
          mutation: addChildren,
          variables: {
            ticketId: this.actualTicket.id,
            children: children.map((t) => t.id),
          },
        })
        .then(() => {
          this.step = 1;
          this.$toast.show(this.$t('children_added'), {
            duration: 1000,
            icon: 'done',
          });
        });
    },
    removeChildren(children) {
      this.dialog = false;
      this.$store.commit('ticket/removeChildren', children);
      this.$apollo
        .mutate({
          mutation: removeChildren,
          variables: {
            ticketId: this.actualTicket.id,
            childrenId: children.id,
          },
        })
        .then(() => {
          this.$toast.show(this.$t('children_removed'), {
            duration: 1000,
            icon: 'done',
          });
        });
    },
  },
};
</script>

<style></style>
