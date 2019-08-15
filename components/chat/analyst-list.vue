<template>
  <v-navigation-drawer app right clipped :mini-variant="mini">
    <v-list
      two-line
    >
      <v-list-tile>
        <v-list-tile-action>
          <v-btn icon class="primary white--text" @click="mini = !mini">
            <v-icon>chat</v-icon>
          </v-btn>
        </v-list-tile-action>
        <v-list-tile-content>
          Ocultar o chat
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-action>
          <v-menu left :close-on-content-click="false" :nudge-width="350">
            <template v-slot:activator="{ on }">
              <v-btn icon class="primary white--text" v-on="on">
                <v-icon>search</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-text-field v-model="searchAnalyst" box label="Buscar analista" />
            </v-card>
          </v-menu>
        </v-list-tile-action>
        <v-list-tile-content>
          Buscar
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-action>
          <v-menu left :close-on-content-click="false" :nudge-width="350">
            <template v-slot:activator="{ on }">
              <v-btn icon class="primary white--text" v-on="on">
                <v-icon>build</v-icon>
              </v-btn>
            </template>
            <analyst-status />
          </v-menu>
        </v-list-tile-action>
        <v-list-tile-content>
          Alterar status
        </v-list-tile-content>
      </v-list-tile>
      <v-menu
        v-for="analyst in analysts"
        :key="analyst._id"
        offset-x
      >
        <template
          v-slot:activator="{ on }"
        >
          <v-list-tile @click="openChat(analyst)">
            <v-list-tile-avatar
              v-on="on"
            >
              <v-badge
                overlap
              >
                <template
                  v-slot:badge
                >
                  <v-icon
                    :class="`${getStatus(analyst.status)} white--text`"
                  >
                    chat
                  </v-icon>
                </template>
                <v-avatar>
                  <v-img
                    :src="analyst.picture"
                  />
                </v-avatar>
              </v-badge>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ analyst.name }}
              </v-list-tile-title>
              <v-list-tile-sub-title>
                {{ analyst.email }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
        <v-card>
          <v-layout
            row
            wrap
          >
            <v-flex
              xs4
              pa-2
            >
              <v-img
                :src="analyst.picture"
                :alt="analyst.name"
              />
            </v-flex>
            <v-flex
              xs8
              pa-2
            >
              <v-layout
                row
                wrap
              >
                <v-flex
                  xs12
                  pa-2
                >
                  {{ analyst.name }}
                </v-flex>
                <v-flex
                  xs12
                  pa-2
                >
                  Ultima vez ativo {{ analyst.lastTimeActive }}
                </v-flex>
                <v-flex
                  xs-12
                  pa-1
                >
                  <v-btn
                    title="Chamados abertos"
                    icon
                    class="white primary--text"
                    @click="viewRecents(analyst._id)"
                  >
                    <v-icon>
                      work
                    </v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
      </v-menu>
      <v-dialog
        v-model="showModal"
        scrollable
      >
        <v-card>
          <v-layout row wrap>
            <v-flex xs12 pa-2>
              <ticket-list
                v-if="showModal"
                :url="`/search/`"
              />
            </v-flex>
          </v-layout>
        </v-card>
      </v-dialog>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
import AnalystStatus from './status'
import TicketList from '@/components/ticket/list'
export default {
  components: {
    TicketList,
    AnalystStatus
  },
  data() {
    return {
      mini: true,
      showModal: false,
      searchAnalyst: ''
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/getUser'
    }),
    analysts() {
      return this.$store.getters['analyst/getAnalysts']
        .filter(analyst => {
          return analyst._id !== this.user._id
        })
        .filter(analyst => {
          return analyst.name
            .toLowerCase()
            .includes(this.searchAnalyst.toLowerCase())
        })
    }
  },
  created() {
    this.$axios.get('/analyst').then(reponse => {
      this.$store.commit('analyst/setAnalysts', reponse.data)
    })
  },
  mounted() {
    this.$socket.on('chat/status/update', newInfo => {
      this.$store.commit('analyst/updateStatus', newInfo)
    })
  },
  methods: {
    openChat(analyst) {
      this.$store.commit('chat/setVisible', true)
      this.$store.commit('chat/setActive', analyst._id)
      this.$store.dispatch('chat/getMessages', analyst)
    },
    getStatus(status) {
      const colors = [
        {
          status: 'offline',
          color: 'black'
        },
        {
          status: 'busy',
          color: 'red'
        },
        {
          status: 'away',
          color: 'yellow'
        },
        {
          status: 'online',
          color: 'green'
        }
      ]
      const result = colors.find(s => {
        return s.status === status
      })
      if (result) return result.color
      return 'black'
    },
    viewRecents(id) {
      this.showModal = true
      this.$router.push({
        query: {
          openedBy: id
        }
      })
    }
  }
}
</script>

<style>
</style>
