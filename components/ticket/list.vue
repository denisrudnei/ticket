<template>
  <v-data-table
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
        title="Ver chamado"
        @click="addTicketsToEdit(item)"
      >
        <v-icon>
          search
        </v-icon>
      </v-btn>
    </template>
    <template v-slot:item.actualUser="{ item }">
      <v-list-item>
        <v-list-item-avatar>
          <v-img :src="item.actualUser.picture" />
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
      <v-edit-dialog large @save="modifyStatus(item)">
        {{ item.status.name }}
        <template v-slot:input>
          <v-row>
            <v-col
              cols="12"
              pa-4
            >
              <v-select
                v-model="currentStatus"
                :items="status.find(s => {return s._id === item.status._id}).allowedStatus.map(s => ({ text: s.name, value: s }))"
                filled
                label="Status"
              />
            </v-col>
          </v-row>
        </template>
      </v-edit-dialog>
    </template>
    <template v-slot:item.group="{ item }">
      <v-edit-dialog large @save="transferToGroup(item)">
        <template v-slot:input>
          <v-row>
            <v-col
              cols="12"
              pa-1
            >
              <v-select
                v-model="currentGroup"
                :items="groups.filter(g => {return g._id !== item.group._id}).map(g => ({ text: g.name, value: g }))"
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
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex'
const querystring = require('querystring')

export default {
  props: {
    url: {
      type: String,
      default: '/ticket/'
    },
    modal: {
      type: Boolean,
      default: false
    },
    search: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      currentGroup: {},
      currentStatus: {},
      totalItems: 0,
      footerProps: {
        itemsPerPageOptions: [10, 15, 25, 50],
        itemsPerPage: 10
      },
      options: {
        sortBy: ['created'],
        descending: true,
        totalItems: 0,
        page: 1
      },
      headers: [
        {
          text: 'Ver chamado',
          sortable: false,
          value: 'actions'
        },
        {
          text: 'Usuário atual',
          value: 'actualUser'
        },
        {
          text: 'Resumo',
          value: 'resume'
        },
        {
          text: 'Status',
          value: 'status'
        },
        {
          text: 'Grupo',
          value: 'group'
        },
        {
          text: 'Categoria',
          value: 'category'
        },
        {
          text: 'Data de criação',
          value: 'created'
        }
      ]
    }
  },
  computed: {
    query: {
      get() {
        if (this.modal) return this.$store.getters['ticket/getModalQuery']
        return this.$store.getters['ticket/getQuery']
      },
      set(value) {
        this.$store.commit('ticket/setQuery', value)
      }
    },
    tickets: {
      get() {
        if (this.modal) return this.$store.getters['ticket/getModalTickets']

        if (this.url === '/search/')
          return this.$store.getters['ticket/getSearch']
        return this.$store.getters['ticket/getTickets']
      },
      set(value) {
        this.$store.commit('ticket/setTickets', value)
      }
    },
    ...mapGetters({
      status: 'status/getStatus',
      groups: 'group/getGroups',
      dialog: 'ticket/getDialog',
      actualTicket: 'ticket/getActualTicket'
    })
  },
  watch: {
    dialog: function(value) {
      if (this.modal) return
      const query = Object.assign({}, this.query, {
        ticket: value || this.query.ticket || null
      })
      this.$router.push({
        query: query
      })
      this.$store.commit('ticket/setQuery', query)
    },
    $route: async function(newValue) {
      this.$store.commit('ticket/setQuery', newValue.query)
      await this.update()
    },
    options: {
      deep: true,
      handler: function(newValue, old) {
        if (
          old.page === newValue.page &&
          old.sortBy === newValue.sortBy &&
          old.sortDesc === newValue.sortDesc &&
          old.itemsPerPage === newValue.itemsPerPage &&
          old.descending === newValue.descending
        )
          return
        this.loading = 'primary'

        const query = Object.assign({}, this.query, {
          page: newValue.page,
          limit: this.options.itemsPerPage,
          sortBy: newValue.sortBy[0],
          descending: newValue.sortDesc[0] ? -1 : 1
        })

        this.setQuery(query)
      }
    }
  },
  async created() {
    this.$axios.get('/group').then(response => {
      this.$store.commit('group/setGroups', response.data)
    })
    this.$axios.get('/status').then(response => {
      this.$store.commit('status/setStatus', response.data)
    })
    const query = this.$route.query
    if (query.ticket !== undefined && query.ticket !== null) {
      await this.$store.dispatch('ticket/findTicket', query.ticket)

      await this.addTicketsToEdit(this.actualTicket)
    }
    await this.update()
  },
  methods: {
    async update() {
      const query = this.query
      await this.$axios
        .get(`${this.url}?${querystring.encode(query)}`)
        .then(response => {
          const { docs, total, limit, page } = response.data
          if (this.modal) {
            this.$store.commit('ticket/setModalTickets', docs)
          } else {
            this.$store.commit('ticket/setTickets', docs)
            this.$store.commit('ticket/setSearch', docs)
          }
          this.totalItems = parseInt(total)
          this.options.page = parseInt(page)
          this.options.itemsPerPage = parseInt(limit)
          this.loading = false
        })
    },
    async setQuery(query) {
      if (this.modal) {
        this.$store.commit('ticket/setModalQuery', query)
      } else {
        this.$store.commit('ticket/setQuery', query)
      }
      await this.update()
    },
    modifyStatus(ticket) {
      this.$axios
        .post(`/ticket/updateStatus/${ticket._id}`, this.currentStatus)
        .then(() => {
          this.$toast.show('Status alterado', {
            duration: 5000
          })
        })
    },
    transferToGroup(ticket) {
      this.$axios
        .post(`/ticket/transfer/${ticket._id}`, this.currentGroup)
        .then(() => {
          this.$toast.show(
            `Movido com sucesso ao grupo ${this.currentGroup.name}`,
            {
              duration: 5000
            }
          )
        })
    },
    async setDialog(id) {
      await this.$store.dispatch('ticket/findTicket', id)
      await this.$store.commit('ticket/setDialog', id)
    },
    async addTicketsToEdit(ticket) {
      await this.$store.commit('ticket/setActualTicket', ticket)
      await this.$store.commit('ticket/setDialog', ticket._id)
      await this.$store.commit('ticket/addTicketsToEdit', ticket)
    }
  }
}
</script>
<style>
td > .v-btn--block {
  display: inline-flex !important;
}
</style>
