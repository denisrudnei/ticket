<template>
  <v-data-table
    :items="tickets"
    :search="search"
    :headers="headers"
  >
    <template
      slot="items"
      slot-scope="data"
    >
      <td>
        <v-menu
          :nudge-width="200"
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
            <v-menu
              :nudge-width="400"
              offset-x
              offset-y
              :close-on-content-click="false"
            >
              <template
                v-slot:activator="{ on }"
              >
                <v-btn
                  class="primary white--text"
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
                        :items="groups.map(g => ({ text: g.name, value: g }))"
                        box
                        label="Para qual grupo? "
                      />
                      <v-btn
                        icon
                        class="primary white--text"
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
              :nudge-width="400"
              offset-x
              :close-on-content-click="false"
            >
              <template
                v-slot:activator="{ on }"
              >
                <v-btn
                  flat
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
                        :items="status.map(s => ({ text: s.name, value: s }))"
                        box
                        label="Status"
                      />
                      <v-btn
                        icon
                        class="primary white--text"
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
              {{ data.item.actualUser.name }}
            </v-btn>
          </template>
          <v-card>
            <!-- {{ data.item.actualUser }} -->
            <v-list>
              <v-list-tile>
                <v-list-tile-avatar>
                  <img src="https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-734918.jpg">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ data.item.actualUser.name }}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    {{ data.item.actualUser.email }}
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-menu>
        <!-- <nuxt-link
          :to="`/ticket/${data.item._id}`"
        >
          {{ data.item.actualUser.name }}
        </nuxt-link> -->
      </td>
      <td>{{ data.item.resume }}</td>
      <td>{{ data.item.status.name }}</td>
      <td>{{ data.item.group.name }}</td>
      <td>{{ data.item.category.fullName }}</td>
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
      headers: [
        {
          text: 'Ações',
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
        }
      ]
    }
  },
  computed: mapGetters({
    status: 'status/getStatus',
    groups: 'group/getGroups'
  })
}
</script>
