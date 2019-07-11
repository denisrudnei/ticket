<template>
  <v-app>
    <v-navigation-drawer
      v-if="logged"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      permanent
      app
    >
      <v-list>
        <v-list-tile>
          <v-list-tile-action>
            <v-btn
              v-if="logged"
              icon
              @click.stop="miniVariant = !miniVariant"
            >
              <v-icon>
                {{ miniVariant ? 'chevron_right' : 'chevron_left' }}
              </v-icon>
            </v-btn>
          </v-list-tile-action>
          <v-list-tile-content>
            Ocular barra
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-tile-action>
            <v-icon>
              {{ item.icon }}
            </v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-spacer />
      <ticket-tree v-show="!miniVariant" />
      <v-spacer />
      <analyst-list
        v-if="logged"
      />
    </v-navigation-drawer>
    <Toolbar
      :logged="logged"
      :clipped="clipped"
    />
    <TicketDialog />
    <v-content>
      <v-layout
        row
        wrap
      >
        <template
          v-if="logged"
        >
          <v-flex
            xs12
            pa-2
          >
            <v-btn
              to="/ticket/create"
              class="primary"
            >
              Criar incidente
            </v-btn>
            <v-btn
              to="/search"
              class="primary"
            >
              Pesquisar
            </v-btn>
            <v-btn
              class="primary white--text"
              to="/knowledge"
            >
              Base de conhecimento
            </v-btn>
          </v-flex>
        </template>
      </v-layout>
      <nuxt />
      <v-layout
        row
        wrap
      >
        <v-flex
          xs12
          pa-2
        >
          <v-speed-dial
            v-if="logged"
            v-model="fab"
            bottom
            right
            fixed
            direction="top"
          >
            <template
              v-slot:activator
            >
              <v-btn
                v-model="fab"
                fab
                class="primary white--text"
              >
                <v-icon>apps</v-icon>
                <v-icon>close</v-icon>
              </v-btn>
            </template>
            <v-btn
              v-for="ticket in ticketsToEdit"
              :key="ticket._id"
              :title="ticket._id"
              class="primary white--text"
              fab
              @click="setDialog(ticket)"
            >
              <v-icon>
                search
              </v-icon>
            </v-btn>
          </v-speed-dial>
        </v-flex>
      </v-layout>
    </v-content>
    <Chat
      v-if="logged"
    />
    <v-footer
      fixed
      app
    >
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import Toolbar from '@/components/toolbar'
import TicketDialog from '@/components/ticket/dialog'
import AnalystList from '@/components/analyst-list'
import Chat from '@/components/chat'
import TicketTree from '@/components/ticket/tree'

export default {
  components: {
    Toolbar,
    TicketDialog,
    AnalystList,
    Chat,
    TicketTree
  },
  data() {
    return {
      fab: true,
      notificationGroups: [],
      items: [
        {
          icon: 'bookmarks',
          title: 'Chamados',
          to: '/'
        },
        {
          icon: 'insert_chart',
          title: 'Relatórios',
          to: '/reports'
        }
      ],
      miniVariant: true,
      right: true,
      clipped: true
    }
  },
  computed: mapGetters({
    tickets: 'ticket/getTickets',
    logged: 'auth/getLoggedIn',
    user: 'auth/getUser',
    groups: 'group/getGroups',
    ticketsToEdit: 'ticket/getTicketsToEdit'
  }),
  created() {
    this.$axios.get('/group').then(response => {
      this.$store.commit('group/setGroups', response.data)
    })
  },
  updated() {
    if (this.logged) {
      setTimeout(() => {
        this.$vuetify.theme.primary =
          this.user.color || this.$vuetify.theme.primary
      }, 0)
    }
  },
  async mounted() {
    if (this.logged) {
      await this.$store.dispatch('downloadInfo')
      this.$axios.post('/auth/mergeUser', this.user)
      this.$socket.on(`message/${this.user._id}`, message => {
        this.$toast.show('Mensagem recebida', {
          duration: 1000
        })
        this.$store.commit('chat/setActive', message.chatId)
        // this.$store.dispatch('chat/addMessage', message)
      })
    }

    this.notificationGroups = this.groups.filter(g => {
      return g.analysts.map(a => a._id).includes(this.user._id)
    })

    this.$socket.on('readNotification', notification => {
      this.$store.commit('notification/updateNotification', notification)
    })

    this.$socket.on('updateTicket', ticket => {
      // TODO
      this.$store.dispatch('ticket/updateTree')
      this.$store.commit('ticket/updateTicket', ticket)
    })

    this.$socket.on('addTicket', ticket => {
      // TODO
      this.$store.dispatch('ticket/updateTree')
      this.$store.commit('ticket/insertTicket', ticket)
    })

    this.$socket.on('paths/updatePath', paths => {
      this.$store.dispatch('ticket/updateTree')
    })

    this.notificationGroups.forEach(group => {
      this.$socket.on(`notification/${group._id}`, notification => {
        this.$store.commit('notification/addNotification', notification)
      })
    })
  },
  methods: {
    fetchUrl(item) {
      this.$router.push('/search/' + item.name)
    },
    setDialog(ticket) {
      this.$store.commit('ticket/setActualTicket', ticket)
      this.$store.commit('ticket/setDialog', ticket._id)
    }
  }
}
</script>
