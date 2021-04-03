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
        :server-items-length="options.totalItems"
        :options.sync="options"
      >
        <template #item.actions="{ item }">
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
        <template #item.copy="{ item }">
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
        <template #item.id="{ item }">
          {{ item.id }}
        </template>
        <template #item.priority="{ item }">
          {{ item.priority.name }}
        </template>
        <template #item.actualUser="{ item }">
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
        <template #item.resume="{ item }">
          {{ item.resume }}
        </template>
        <template #item.status="{ item }">
          <v-edit-dialog
            large
            @save="modifyStatus(item)"
          >
            {{ item.status.name }}
            <template #input>
              <v-row>
                <v-col
                  cols="12"
                  class="mt-2"
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
        <template #item.group="{ item }">
          <v-edit-dialog
            large
            @save="transferToGroup(item)"
          >
            <template #input>
              <v-row>
                <v-col
                  cols="12"
                  class="mt-2"
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
        <template #item.category="{ item }">
          {{ item.category.fullName }}
        </template>
        <template #item.created="{ item }">
          {{ item.created | date }}
        </template>
        <template #item.modified="{ item }">
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

import changeStatus from '@/graphql/mutation/ticket/changeStatus';
import transferToGroup from '@/graphql/mutation/ticket/transferToGroup';
import ticketSearch from '@/graphql/query/search/ticket';
import ticketAttributes from '@/graphql/query/search/ticketAttributes';
import changeStatusOfTickets from '@/graphql/mutation/ticket/list/changeStatusOfTickets';
import transferTickets from '@/graphql/mutation/ticket/list/transferTickets';
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
      selected: [],
      showUpdateMany: false,
      selectedStatus: undefined,
      selectedGroup: undefined,
      currentGroup: {},
      currentStatus: {},
      footerProps: {
        itemsPerPageOptions: [10, 15, 25, 50],
        itemsPerPage: 10,
      },
    };
  },
  head() {
    return {
      title: `Page ${this.options.page}, total ${this.options.totalItems}`,
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
    options: {
      get() {
        return this.$store.getters['ticket/getPagination'];
      },
      set(value) {
        this.updateOptions(value);
      },
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
        return this.$store.getters['ticket/getTickets'];
      },
      set(value) {
        this.$store.commit('ticket/setTickets', value);
      },
    },
    ...mapGetters({
      loading: 'ticket/getLoading',
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
  },
  async mounted() {
    const { query } = this.$route;
    this.setQuery(query);
    this.$store.commit('ticket/setPage', query.page || 1);
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
            mutation: changeStatusOfTickets,
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
            mutation: transferTickets,
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
      const update = value.page !== this.options.page;
      const query = {
        ...this.query,
        page: value.page,
        limit: value.itemsPerPage,
        sortBy: value.sortBy,
        descending: value.sortDesc.some((value) => !!value) ? -1 : 1,
      };

      this.$store.commit('ticket/setPagination', {
        ...value,
        page: value.page,
        sortBy: value.sortBy,
        limit: value.itemsPerPage,
        descending: query.descending,
        totalItems: value.totalItems,
      });
      this.setQuery(query);
      this.$emit('updatePagination');
    },
    getTicketAttributes() {
      this.$apollo
        .query({
          query: ticketAttributes,
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
      this.$emit('updateAttributes', attributes);
    },
    setQuery(query) {
      if (this.modal) {
        this.$store.commit('ticket/setModalQuery', query);
      } else {
        this.$store.commit('ticket/setQuery', query);
      }
    },
    modifyStatus(ticket) {
      this.$apollo
        .mutate({
          mutation: changeStatus,
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
          mutation: transferToGroup,
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
};
</script>
<style>
td > .v-btn--block {
  display: inline-flex !important;
}
</style>
