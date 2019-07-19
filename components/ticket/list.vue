<template>
  <v-data-table
    :items="tickets"
    :headers="headers"
    must-sort
    :loading="loading"
    :rows-per-page-items="rowsPerPageItems"
    :total-items="pagination.totalItems"
    :pagination.sync="pagination"
  >
    <template
      v-slot:items="{ item }"
    >
      <td>
        <v-btn
          class="primary white--text"
          icon
          @click="addTicketsToEdit(item)"
        >
          <v-icon>
            search
          </v-icon>
        </v-btn>
        <v-menu
          :nudge-width="300"
          :close-on-content-click="false"
          offset-x
        >
          <template
            v-slot:activator="{ on }"
          >
            <v-btn
              class="primary white--text"
              icon
              v-on="on"
            >
              <v-icon>
                build
              </v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-layout
              row
              wrap
            >
              <v-flex
                xs12
                pa-2
              >
                <v-menu
                  offset-x
                  offset-y
                  :close-on-content-click="false"
                >
                  <template
                    v-slot:activator="{ on }"
                  >
                    <v-btn
                      class="primary white--text"
                      block
                      v-on="on"
                    >
                      Transferir
                      <v-icon
                        right
                      >
                        transfer_within_a_station
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-layout
                      row
                      wrap
                    >
                      <v-flex
                        xs12
                        pa-1
                      >
                        <v-form>
                          <v-select
                            v-model="currentGroup"
                            :items="groups.filter(g => {return g._id !== item.group._id}).map(g => ({ text: g.name, value: g }))"
                            box
                            label="Para qual grupo? "
                          />
                          <v-btn
                            icon
                            class="primary white--text"
                            @click="transferToGroup(item)"
                          >
                            <v-icon>
                              send
                            </v-icon>
                          </v-btn>
                        </v-form>
                      </v-flex>
                    </v-layout>
                  </v-card>
                </v-menu>
                <v-menu
                  offset-x
                  :close-on-content-click="false"
                >
                  <template
                    v-slot:activator="{ on }"
                  >
                    <v-btn
                      flat
                      block
                      class="primary white--text"
                      v-on="on"
                    >
                      Atualizar status
                    </v-btn>
                  </template>
                  <v-card>
                    <v-layout
                      row
                      wrap
                    >
                      <v-flex
                        xs12
                        pa-1
                      >
                        <v-form>
                          <v-select
                            v-model="currentStatus"
                            :items="status.filter(s => {return s._id !== item.status._id}).map(s => ({ text: s.name, value: s }))"
                            box
                            label="Status"
                          />
                          <v-btn
                            icon
                            class="primary white--text"
                            @click="modifyStatus(item)"
                          >
                            <v-icon>
                              send
                            </v-icon>
                          </v-btn>
                        </v-form>
                      </v-flex>
                    </v-layout>
                  </v-card>
                </v-menu>
              </v-flex>
            </v-layout>
          </v-card>
        </v-menu>
      </td>
      <td>
        <v-menu
          open-on-hover
          offset-y
          :close-on-content-click="false"
          :nudge-width="200"
        >
          <template
            v-slot:activator="{ on }"
          >
            <v-btn
              class="primary white--text"
              block
              flat
              v-on="on"
            >
              {{ item.actualUser.name }}
            </v-btn>
          </template>
          <v-card>
            <v-list>
              <v-list-tile>
                <v-list-tile-avatar>
                  <v-img :src="item.actualUser.picture" />
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ item.actualUser.name }}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    {{ item.actualUser.contactEmail }}
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-menu>
      </td>
      <td>{{ item.resume }}</td>
      <td>{{ item.status.name }}</td>
      <td>{{ item.group.name }}</td>
      <td>{{ item.category.fullName }}</td>
      <td>{{ item.created | date }}</td>
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
      pagination: {
        sortBy: 'created',
        descending: true,
        totalItems: 0,
        page: 1,
        rowsPerPage: 5
      },
      rowsPerPageItems: [5, 10, 15, 25, 50],
      headers: [
        {
          text: 'Ações',
          sortable: false
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
  computed: mapGetters({
    tickets: 'ticket/getTickets',
    status: 'status/getStatus',
    groups: 'group/getGroups',
    dialog: 'ticket/getDialog',
    actualTicket: 'ticket/getActualTicket'
  }),
  watch: {
    dialog: function(value) {
      const query = Object.assign({}, this.$route.query, {
        ticket: value || this.$route.query.ticket || null
      })

      this.$router.push({
        query: query
      })
    },
    $route: async function(newValue) {
      await this.update()
    },
    pagination: {
      deep: true,
      handler: function(newValue, old) {
        if (
          old.page === newValue.page &&
          old.rowsPerPage === newValue.rowsPerPage &&
          old.sortBy === newValue.sortBy &&
          old.descending === newValue.descending
        )
          return
        this.loading = 'primary'
        this.$router.push({
          query: Object.assign({}, this.$route.query, {
            page: newValue.page,
            limit: newValue.rowsPerPage,
            sortBy: newValue.sortBy,
            descending: newValue.descending ? -1 : 1
          })
        })
      }
    }
  },
  async created() {
    await this.$axios.get('/group').then(response => {
      this.$store.commit('group/setGroups', response.data)
    })
    await this.$axios.get('/status').then(response => {
      this.$store.commit('status/setStatus', response.data)
    })
    const query = this.$route.query
    if (query.ticket !== undefined) {
      await this.$store.dispatch('ticket/findTicket', query.ticket)

      await this.addTicketsToEdit(this.actualTicket)
    }
    await this.update()
  },
  methods: {
    async update() {
      const query = this.$router.currentRoute.query
      await this.$axios
        .get(`${this.url}?${querystring.encode(query)}`)
        .then(response => {
          const { docs, total, limit, page } = response.data
          this.$store.commit('ticket/setTickets', docs)
          this.$store.commit('ticket/setSearch', docs)
          this.$store.commit('ticket/setTickets', docs)
          this.pagination.totalItems = parseInt(total)
          this.pagination.page = parseInt(page)
          this.pagination.rowsPerPage = parseInt(limit)
          this.loading = false
        })
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
