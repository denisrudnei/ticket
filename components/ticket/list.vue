<template>
  <v-row>
    <v-col cols="12">
      <v-btn
        v-if="selected.length > 0"
        class="primary white--text"
        @click="showUpdateMany = true"
      >
        {{ $t('update_many') }}
      </v-btn>
    </v-col>
    <v-col cols="12">
      <v-data-table
        v-model="selected"
        :show-select="true"
        item-key="id"
        :items="tickets"
        :headers="headers"
        must-sort
        :loading="loading"
        :footer-props.sync="footerProps"
        :server-items-length.sync="totalItems"
        :options.sync="options"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn
            class="primary white--text"
            icon
            :title="$t('see_ticket')"
            @click="addTicketsToEdit(item)"
          >
            <v-icon>
              search
            </v-icon>
          </v-btn>
        </template>
        <template v-slot:item.copy="{ item }">
          <v-btn
            class="primary white--text"
            icon
            :title="$t('copy_ticket')"
            @click="confirm(item)"
          >
            <v-icon>
              file_copy
            </v-icon>
          </v-btn>
        </template>
        <template v-slot:item.id="{ item }">
          {{ item.id }}
        </template>
        <template v-slot:item.priority="{ item }">
          {{ item.priority.name }}
        </template>
        <template v-slot:item.actualUser="{ item }">
          <v-list-item
            v-if="item.actualUser"
            :to="`/analyst/${item.actualUser.id}`"
          >
            <v-list-item-avatar>
              <img :src="item.actualUser.picture">
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.actualUser.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ item.actualUser.contactEmail }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
        <template v-slot:item.resume="{ item }">
          {{ item.resume }}
        </template>
        <template v-slot:item.status="{ item }">
          <v-edit-dialog
            large
            @save="modifyStatus(item)"
          >
            {{ item.status.name }}
            <template v-slot:input>
              <v-row>
                <v-col
                  cols="12"
                  pa-4
                >
                  <v-select
                    v-if="status.find((s) => {
                      return s.id === item.status.id
                    })"
                    v-model="currentStatus"
                    :items="
                      status
                        .find((s) => {
                          return s.id === item.status.id
                        })
                        .allowedStatus.map((s) => ({ text: s.name, value: s }))
                    "
                    filled
                    :label="$t('status')"
                  />
                </v-col>
              </v-row>
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:item.group="{ item }">
          <v-edit-dialog
            large
            @save="transferToGroup(item)"
          >
            <template v-slot:input>
              <v-row>
                <v-col
                  cols="12"
                  pa-1
                >
                  <v-select
                    v-model="currentGroup"
                    :items="
                      groups
                        .filter((g) => {
                          return g.id !== item.group.id
                        })
                        .map((g) => ({ text: g.name, value: g }))
                    "
                    filled
                    label="Para qual grupo? "
                  />
                </v-col>
              </v-row>
            </template>
            {{ item.group.name }}
          </v-edit-dialog>
        </template>
        <template v-slot:item.category="{ item }">
          {{ item.category.fullName }}
        </template>
        <template v-slot:item.created="{ item }">
          {{ item.created | date }}
        </template>
        <template v-slot:item.modified="{ item }">
          {{ item.modified | date }}
        </template>
      </v-data-table>
    </v-col>

    <v-col
      v-if="selected.length > 0"
      cols="12"
    >
      <v-dialog
        v-model="showUpdateMany"
        max-width="50vw"
      >
        <v-card>
          <v-card-title> Total: {{ selected.length }} </v-card-title>
          <v-card-text>
            <v-autocomplete
              v-model="selectedStatus"
              :items="
                status.map((s) => {
                  return { text: s.name, value: s }
                })
              "
              :label="$t('status')"
              filled
            />
            <v-autocomplete
              v-model="selectedGropus"
              :items="
                groups.map((g) => {
                  return { text: g.name, value: g }
                })
              "
              :label="$t('group')"
              filled
            />
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="primary white--text"
              @click="updateMany"
            >
              {{ $t('update') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';
import ggl from 'graphql-tag';
import changeStatus from '@/graphql/mutation/ticket/changeStatus.graphql';
import transferToGroup from '@/graphql/mutation/ticket/transferToGroup.graphql';
import ticketSearch from '@/graphql/query/search/ticket.graphql';
import ticketAttributes from '@/graphql/query/search/ticketAttributes.graphql';
import changeStatusOfTickets from '@/graphql/mutation/ticket/list/changeStatusOfTickets.graphql';
import transferTickets from '@/graphql/mutation/ticket/list/transferTickets.graphql';
import addTicketsToEdit from '@/mixins/addTicketToEdit';

export default {
  mixins: [addTicketsToEdit],
  props: {
    url: {
      type: String,
      default: '/ticket/',
    },
    modal: {
      type: Boolean,
      default: false,
    },
    search: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loading: false,
      selected: [],
      showUpdateMany: false,
      selectedStatus: undefined,
      selectedGroup: undefined,
      currentGroup: {},
      currentStatus: {},
      totalItems: 0,
      footerProps: {
        itemsPerPageOptions: [10, 15, 25, 50],
        itemsPerPage: 10,
      },
      options: {
        sortBy: ['id'],
        descending: true,
        sortDesc: [true],
        totalItems: 0,
        itemsPerPage: 10,
        page: 1,
      },
    };
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t('see_ticket'),
          sortable: false,
          value: 'actions',
        },
        {
          text: this.$t('copy_ticket'),
          sortable: false,
          value: 'copy',
        },
        {
          text: this.$t('number_of_ticket'),
          value: 'id',
        },
        {
          text: this.$t('priority'),
          value: 'priority',
        },
        {
          text: this.$t('actual_user'),
          value: 'actualUser',
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
    query: {
      get() {
        if (this.modal) return this.$store.getters['ticket/getModalQuery'];
        return this.$store.getters['ticket/getQuery'];
      },
      set(value) {
        this.$store.commit('ticket/setQuery', value);
      },
    },
    tickets: {
      get() {
        if (this.modal) return this.$store.getters['ticket/getModalTickets'];

        if (this.url === '/search/') return this.$store.getters['ticket/getSearch'];
        return this.$store.getters['ticket/getTickets'];
      },
      set(value) {
        this.$store.commit('ticket/setTickets', value);
      },
    },
    ...mapGetters({
      status: 'status/getStatus',
      groups: 'group/getGroups',
      dialog: 'ticket/getDialog',
      actualTicket: 'ticket/getActualTicket',
    }),
  },
  watch: {
    dialog(value) {
      if (this.modal) return;
      const { query } = this;
      if (value || this.query.ticket) {
        query.ticket = value || this.query.ticket;
      }

      this.$store.commit('ticket/setQuery', query);
    },
    options: {
      deep: true,
      handler(newValue, old) {
        if (
          old.page === newValue.page
          && old.sortBy === newValue.sortBy
          && old.sortDesc === newValue.sortDesc
          && old.itemsPerPage === newValue.itemsPerPage
          && old.descending === newValue.descending
        ) return;

        this.loading = 'primary';
        this.updateOptions(newValue);
      },
    },
  },
  async mounted() {
    const { query } = this.$route;

    this.setQuery(query);
    this.options.page = query.page || 1;
    if (query.ticket !== undefined && query.ticket !== null) {
      await this.$store.dispatch('ticket/findTicket', query.ticket);
      this.addTicketsToEdit(this.actualTicket);
    }
    this.getTicketAttributes();
    await this.update();
  },
  methods: {
    updateMany() {
      if (this.selectedStatus) {
        this.$apollo
          .mutate({
            mutation: ggl(changeStatusOfTickets),
            variables: {
              tickets: this.selected.map((ticket) => ticket.id),
              statusId: this.selectedStatus.id,
            },
          })
          .then(() => {
            this.showUpdateMany = false;
          });
      }
      if (this.selectedGroup) {
        this.$apollo
          .mutate({
            mutation: ggl(transferTickets),
            variables: {
              tickets: this.selected.map((ticket) => ticket.id),
              groupId: this.selectedGroup.id,
            },
          })
          .then(() => {
            this.showUpdateMany = false;
          });
      }
    },
    updateOptions(value) {
      const sortBy = Array.isArray(value.sortBy) ? value.sortBy[0] : value.sortBy;

      const query = {
        ...this.query,
        page: value.page,
        limit: this.options.itemsPerPage,
        sortBy,
        descending: value.sortDesc[0] ? -1 : 1,
      };
      this.setQuery(query);
    },
    getTicketAttributes() {
      this.$apollo
        .query({
          query: ggl(ticketAttributes),
        })
        .then((response) => {
          this.$store.commit('status/setStatus', response.data.Status);
          this.$store.commit('category/setCategories', response.data.Category);
          this.$store.commit('group/setGroups', response.data.Group);
          this.$store.commit('analyst/setAnalysts', response.data.Analyst);
        });
    },
    async update() {
      const { query } = this;
      const fields = [
        'category',
        'affectedUser',
        'actualUser',
        'openedBy',
        'status',
        'address',
        'group',
        'priority',
        'id',
        'ids',
      ];
      const attributes = {};
      Object.keys(query).forEach((key) => {
        if (fields.includes(key)) {
          attributes[key] = query[key];
        }
      });
      await this.$apollo
        .query({
          query: ggl(ticketSearch),
          fetchPolicy: 'network-only',
          variables: {
            sortBy: query.sortBy || 'id',
            page: parseInt(query.page, 10) || 1,
            limit: parseInt(query.limit, 10) || 10,
            descending: parseInt(query.descending, 10) || -1,
            attributes,
          },
        })
        .then((response) => {
          const {
            docs, total, limit, page,
          } = response.data.Tickets;
          if (this.modal) {
            this.$store.commit('ticket/setModalTickets', docs);
          } else {
            this.$store.commit('ticket/setTickets', docs);
            this.$store.commit('ticket/setSearch', docs);
          }
          this.totalItems = parseInt(total, 10);
          this.options.page = parseInt(page, 10);
          this.options.itemsPerPage = parseInt(limit, 10);
          this.loading = false;
        });
    },
    setQuery(query) {
      if (this.modal) {
        this.$store.commit('ticket/setModalQuery', query);
      } else {
        this.$store.commit('ticket/setQuery', query);
      }
      this.update();
    },
    modifyStatus(ticket) {
      this.$apollo
        .mutate({
          mutation: ggl(changeStatus),
          variables: {
            ticketId: ticket.id,
            statusId: this.currentStatus.id,
          },
        })
        .then((response) => {
          this.$store.commit('ticket/updateTicket', response.data.ChangeStatus);
          this.$toast.show('Status alterado', {
            duration: 5000,
          });
        });
    },
    confirm(ticket) {
      this.$store.commit('ticket/setTicketToCopy', ticket);
      this.$store.commit('ticket/setConfirmCopy', true);
    },
    transferToGroup(ticket) {
      this.$apollo
        .mutate({
          mutation: ggl(transferToGroup),
          variables: {
            ticketId: ticket.id,
            groupId: this.currentGroup.id,
          },
        })
        .then((response) => {
          this.$store.commit(
            'ticket/updateTicket',
            response.data.TransferTicket,
          );
          this.$toast.show(
            `Movido com sucesso ao grupo ${this.currentGroup.name}`,
            {
              duration: 5000,
            },
          );
        });
    },
    async setDialog(id) {
      await this.$store.dispatch('ticket/findTicket', id);
      this.$store.commit('ticket/setDialog', id);
    },
  },
  head() {
    return {
      title: `Page ${this.options.page}, total ${this.totalItems}`,
    };
  },
};
</script>
<style>
td > .v-btn--block {
  display: inline-flex !important;
}
</style>
