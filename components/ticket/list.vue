<template>
  <v-data-table
    :items="tickets"
    :search="search"
    :headers="headers"
    must-sort
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
                            :items="groups.map(g => ({ text: g.name, value: g }))"
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
                            :items="status.map(s => ({ text: s.name, value: s }))"
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
                    {{ item.actualUser.email }}
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
      <td>{{ new Date(item.created) | date }}</td>
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    search: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      pagination: {
        sortBy: 'created',
        descending: true,
        rowsPerPage: -1
      },
      currentGroup: {},
      currentStatus: {},
      headers: [
        {
          text: 'Ações',
          sortable: false
        },
        {
          text: 'Usuário atual',
          value: 'actualUser.name'
        },
        {
          text: 'Resumo',
          value: 'resume'
        },
        {
          text: 'Status',
          value: 'status.name'
        },
        {
          text: 'Grupo',
          value: 'group.name'
        },
        {
          text: 'Categoria',
          value: 'category.fullName'
        },
        {
          text: 'Data de criação',
          value: 'created'
        }
      ]
    }
  },
  computed: mapGetters({
    status: 'status/getStatus',
    groups: 'group/getGroups',
    tickets: 'ticket/getSearch',
    dialog: 'ticket/getDialog'
  }),
  mounted() {
    this.$axios.get('api/group').then(response => {
      this.$store.commit('group/setGroups', response.data)
    })
    this.$axios.get('api/status').then(response => {
      this.$store.commit('status/setStatus', response.data)
    })
    this.$axios.get('api/ticket').then(response => {
      this.$store.commit('ticket/setTickets', response.data)
      this.$store.commit('ticket/setSearch', response.data)
    })
  },
  methods: {
    modifyStatus(ticket) {
      this.$axios
        .post(`api/ticket/updateStatus/${ticket._id}`, this.currentStatus)
        .then(() => {
          this.$toast.show('Status alterado', {
            duration: 5000
          })
        })
    },
    transferToGroup(ticket) {
      this.$axios
        .post(`api/ticket/transfer/${ticket._id}`, this.currentGroup)
        .then(() => {
          this.$toast.show(
            `Movido com sucesso ao grupo ${this.currentGroup.name}`,
            {
              duration: 5000
            }
          )
        })
    },
    setDialog(id) {
      this.$store.commit('ticket/setDialog', id)
    },
    addTicketsToEdit(ticket) {
      this.$store.commit('ticket/setActualTicket', ticket)
      this.$store.commit('ticket/setDialog', ticket._id)
      this.$store.commit('ticket/addTicketsToEdit', ticket)
    }
  }
}
</script>
