<template>
  <v-app>
    <v-navigation-drawer
      v-if="logged"
      :mini-variant="miniVariant"
      clipped
      fixed
      permanent
      app
    >
      <v-list>
        <v-list-item>
          <v-list-item-action>
            <v-btn
              v-if="logged"
              icon
              @click.stop="toggleMini"
            >
              <v-icon>
                {{ miniVariant ? 'chevron_right' : 'chevron_left' }}
              </v-icon>
            </v-btn>
          </v-list-item-action>
          <v-list-item-content>
            {{ $t('hide_bar') }}
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
          :title="item.title"
        >
          <v-list-item-action>
            <v-icon>
              {{ item.icon }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-spacer />
      <ticket-tree v-show="!miniVariant" />
    </v-navigation-drawer>
    <analyst-list v-if="logged" />
    <Toolbar
      :logged="logged"
    />
    <TicketDialog />
    <v-content v-hotkey="keymap">
      <v-container fluid>
        <v-row no-gutters>
          <template
            v-if="logged"
          >
            <v-col>
              <v-btn
                to="/ticket/create"
                class="primary white--text"
                tile
                block
              >
                {{ $t('create_ticket') }}
                <v-icon right>
                  offline_bolt
                </v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                to="/search"
                class="primary white--text"
                tile
                block
              >
                {{ $t('search') }}
                <v-icon right>
                  search
                </v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                class="primary white--text"
                to="/knowledge"
                tile
                block
              >
                {{ $t('knowledge_base') }}
                <v-icon right>
                  folder
                </v-icon>
              </v-btn>
            </v-col>
          </template>
        </v-row>
        <nuxt />
        <template v-if="logged">
          <chat />
          <ticket-modal />
          <logout />
          <hotkey-help />
          <confirm-copy @update="copyTicket" />
        </template>
        <v-speed-dial
          v-if="logged && ticketsToEdit.length > 0"
          v-model="fab"
          bottom
          right
          fixed
          direction="left"
        >
          <template
            v-slot:activator
          >
            <v-btn
              v-model="fab"
              fab
              class="primary white--text"
            >
              <v-icon v-if="fab">
                close
              </v-icon>
              <v-icon v-else>
                apps
              </v-icon>
            </v-btn>
          </template>
          <v-btn
            v-for="ticket in ticketsToEdit"
            :key="ticket._id"
            class="primary white--text"
            :title="ticket.resume"
            @click="setDialog(ticket)"
          >
            {{ ticket.ticketNumber }}
            <v-icon right>
              search
            </v-icon>
          </v-btn>
        </v-speed-dial>
      </v-container>
    </v-content>
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
import ggl from 'graphql-tag'
import afterLogin from '@/mixins/afterLogin'
import Toolbar from '@/components/toolbar'
import TicketDialog from '@/components/ticket/dialog'
import Chat from '@/components/chat/chat'
import TicketTree from '@/components/ticket/tree'
import Logout from '@/components/logout'
import AnalystList from '@/components/chat/analyst-list'
import TicketModal from '@/components/ticket/ticket-modal'
import ConfirmCopy from '@/components/ticket/confirmCopy'
import changeStatus from '@/graphql/subscription/ticket/changeStatus.graphql'
import transferToGroup from '@/graphql/subscription/ticket/transferToGroup.graphql'
import editTicket from '@/graphql/subscription/ticket/editTicket.graphql'
import copyTicket from '@/graphql/mutation/ticket/copyTicket.graphql'
import ticketSearch from '@/graphql/query/search/ticket.graphql'
import hotkeyHelp from '@/components/hotkeyHelp'
export default {
  middleware: ['adminMiddleware'],
  components: {
    Toolbar,
    TicketDialog,
    Chat,
    TicketTree,
    Logout,
    AnalystList,
    TicketModal,
    ConfirmCopy,
    hotkeyHelp
  },
  mixins: [afterLogin],
  data() {
    return {
      fab: true,
      data: {},
      keymap: {
        'alt+p': () => this.$router.push('/profile'),
        'alt+b': () => this.$router.push('/knowledge'),
        'alt+n': () => this.$router.push('/profile/notification/all'),
        'alt+o': () => this.$router.push('/ticket/create'),
        'alt+c': () => this.$router.push('/config'),
        'alt+enter': () => {
          this.$store.commit('hotkeys/toggleShow')
        }
      },
      miniVariant: true,
      right: true,
      clipped: true
    }
  },
  computed: {
    items() {
      return [
        {
          icon: 'bookmarks',
          title: this.$t('total_listing'),
          to: '/'
        },
        {
          icon: 'build',
          title: this.$t('tickets_being_handled'),
          to: '/ticket/profile/actualUser'
        },
        {
          icon: 'person',
          title: this.$t('opened_by_me'),
          to: '/ticket/profile/openedBy'
        },
        {
          icon: 'insert_chart',
          title: this.$t('reports'),
          to: '/reports'
        }
      ]
    },
    ...mapGetters({
      tickets: 'ticket/getTickets',
      logged: 'auth/getLoggedIn',
      user: 'auth/getUser',
      groups: 'group/getGroups',
      ticketsToEdit: 'ticket/getTicketsToEdit'
    })
  },
  apollo: {
    $subscribe: {
      changeStatus: {
        query: ggl(changeStatus),
        result({ data }) {
          this.$store.commit('ticket/updateTicket', data.ChangeStatus)
        }
      },
      editTicket: {
        query: ggl(editTicket),
        variables() {
          return {
            tickets: this.tickets.map(t => {
              return t._id
            })
          }
        },
        result({ data }) {
          this.$store.commit('ticket/updateTicket', data.ticket)
        }
      },
      transferToGroup: {
        query: ggl(transferToGroup),
        result({ data }) {
          this.$store.commit('ticket/updateTicket', data.TransferToGroup)
        }
      }
    }
  },
  mounted() {
    const miniState = localStorage.getItem('mini')
    if (miniState) this.miniVariant = JSON.parse(miniState)
    if (this.logged) {
      this.processInfo()
    }
  },
  created() {
    this.$store.commit('hotkeys/setHotkeys', [
      'ALT + P | Perfil',
      'ALT + B | Base de conhecimento',
      'ALT + C | Configurações',
      'ALT + N | Notificações',
      'ALT + O | Abrir novo chamado'
    ])
  },
  methods: {
    toggleMini() {
      this.miniVariant = !this.miniVariant
      localStorage.setItem('mini', this.miniVariant)
    },
    fetchUrl(item) {
      this.$router.push('/search/' + item.name)
    },
    setDialog(ticket) {
      this.$store.commit('ticket/setActualTicket', ticket)
      this.$store.commit('ticket/setDialog', ticket._id)
    },
    copyTicket(ticket) {
      this.$apollo
        .mutate({
          mutation: ggl(copyTicket),
          variables: {
            ticketId: ticket._id
          },
          refetchQueries: [
            {
              query: ggl(ticketSearch)
            }
          ]
        })
        .then(response => {
          const ticket = response.data.ticket
          this.$store.commit('ticket/setActualTicket', ticket)
          this.$store.commit('ticket/setDialog', ticket._id)
          this.$store.commit('ticket/setConfirmCopy', false)
        })
    }
  }
}
</script>

<style>
.v-badge__badge .v-icon {
  font-size: 14px !important;
}
</style>
