<template>
  <v-data-table
    :items="tickets"
    :search="search"
    :headers="headers"
  >
    <template
      v-slot:items="{ item }"
    >
      <td>
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
                <v-btn
                  :to="`/ticket/${item._id}`"
                  class="primary white--text"
                  block
                >
                  Ver Ticket
                </v-btn>
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
                  <img src="https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-734918.jpg">
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
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    tickets: {
      type: Array,
      default: () => {
        return []
      }
    },
    search: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
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
        }
      ]
    }
  },
  computed: mapGetters({
    status: 'status/getStatus',
    groups: 'group/getGroups'
  }),
  methods: {
    modifyStatus(ticket) {
      // TODO
    },
    transferToGroup(ticket) {
      this.$axios
        .post(`api/ticket/transfer/${ticket._id}`, this.currentGroup)
        .then(() => {
          this.$store.commit('message/setText', 'Movido')
          this.$store.commit('message/setShow', true)
          setTimeout(() => {
            this.$store.commit('message/setShow', false)
          }, 5000)
        })
    }
  }
}
</script>
