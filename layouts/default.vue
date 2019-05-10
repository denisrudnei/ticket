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
      <v-treeview
        v-if="tickets.length > 0"
        v-show="!miniVariant"
        :items="tree"
        open-on-click
        activatable
      >
        <template
          v-slot:prepend="{ item }"
        >
          <v-icon
            v-if="item.children.length === 0"
          >
            layers
          </v-icon>
        </template>
        <template
          v-slot:label="{ item }"
        >
          <span v-if="item.children.length > 0">{{ item.name }}</span>
          <nuxt-link
            v-if="item.children.length === 0"
            :to="item.url"
          >
            {{ item.name }}
          </nuxt-link>
        </template>
      </v-treeview>
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

export default {
  components: {
    Toolbar,
    TicketDialog,
    AnalystList,
    Chat
  },
  data() {
    return {
      fab: true,
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
  computed: {
    ...mapGetters({
      tickets: 'ticket/getTickets',
      logged: 'auth/getLoggedIn',
      user: 'auth/getUser',
      tree: 'ticket/getTree',
      ticketsToEdit: 'ticket/getTicketsToEdit',
      notificationGroups: 'getNotificationGroups'
    })
  },
  async mounted() {
    if (this.logged) {
      await this.$store.dispatch('downloadInfo')
      this.$axios.post('/auth/mergeUser', this.user)
    }

    this.$socket.on('readNotification', notification => {
      this.$store.commit('notification/updateNotification', notification)
    })

    this.$socket.on('updateTicket', ticket => {
      this.$store.commit('ticket/updateTicket', ticket)
    })

    this.$socket.on('addTicket', ticket => {
      this.$store.commit('ticket/insertTicket', ticket)
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
