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
        <v-list-item @click.stop="toggleMini">
          <v-list-item-action>
            <v-btn
              v-if="logged"
              icon
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
    <Toolbar :logged="logged" />
    <TicketDialog />
    <v-main v-hotkey="keymap">
      <v-container fluid>
        <v-row no-gutters>
          <template v-if="logged">
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
            <v-col>
              <v-btn
                class="primary white--text"
                to="/reports"
                tile
                block
              >
                {{ $t('reports') }}
                <v-icon right>
                  insert_chart
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
          <template #activator>
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
            :key="ticket.id"
            class="primary white--text"
            :title="ticket.resume"
            @click="setDialog(ticket)"
          >
            {{ ticket.id }}
            <v-icon right>
              search
            </v-icon>
          </v-btn>
        </v-speed-dial>
      </v-container>
    </v-main>
    <v-footer
      fixed
      app
    >
      <span>&copy; 2020</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import afterLogin from '@/mixins/afterLogin';
import Toolbar from '@/components/toolbar';
import TicketDialog from '@/components/ticket/dialog';
import Chat from '@/components/chat/chat';
import TicketTree from '@/components/ticket/tree';
import Logout from '@/components/logout';
import AnalystList from '@/components/chat/analyst-list';
import TicketModal from '@/components/ticket/ticket-modal';
import ConfirmCopy from '@/components/ticket/confirmCopy';
import changeStatus from '@/graphql/subscription/ticket/changeStatus';
import transferToGroup from '@/graphql/subscription/ticket/transferToGroup';
import editTicket from '@/graphql/subscription/ticket/editTicket';
import copyTicketSubscription from '@/graphql/subscription/ticket/copyTicket';
import slaUpdate from '@/graphql/subscription/ticket/slaUpdate';
import addNotification from '@/graphql/subscription/addNotification';
import updateNotification from '@/graphql/subscription/updateNotification';
import notifications from '@/graphql/subscription/notifications';
import copyTicket from '@/graphql/mutation/ticket/copyTicket';
import ticketSearch from '@/graphql/query/search/ticket';
import hotkeyHelp from '@/components/hotkeyHelp';

export default {
  components: {
    Toolbar,
    TicketDialog,
    Chat,
    TicketTree,
    Logout,
    AnalystList,
    TicketModal,
    ConfirmCopy,
    hotkeyHelp,
  },
  mixins: [afterLogin],
  middleware: ['adminMiddleware'],
  data() {
    return {
      fab: true,
      audio: null,
      data: {},
      keymap: {
        'alt+p': () => this.$router.push('/profile'),
        'alt+b': () => this.$router.push('/knowledge'),
        'alt+n': () => this.$router.push('/profile/notification/all'),
        'alt+o': () => this.$router.push('/ticket/create'),
        'alt+c': () => this.$router.push('/config'),
        'alt+enter': () => {
          this.$store.commit('hotkeys/toggleShow');
        },
      },
      miniVariant: true,
      right: true,
      clipped: true,
    };
  },
  computed: {
    items() {
      return [
        {
          icon: 'bookmarks',
          title: this.$t('total_listing'),
          to: '/',
        },
        {
          icon: 'build',
          title: this.$t('tickets_being_handled'),
          to: '/ticket/profile/actualUser',
        },
        {
          icon: 'person',
          title: this.$t('opened_by_me'),
          to: '/ticket/profile/openedBy',
        },
        {
          icon: 'insert_chart',
          title: this.$t('reports'),
          to: '/reports',
        },
      ];
    },
    ...mapGetters({
      tickets: 'ticket/getTickets',
      logged: 'auth/getLoggedIn',
      user: 'auth/getUser',
      groups: 'group/getGroups',
      ticketsToEdit: 'ticket/getTicketsToEdit',
      query: 'ticket/getQuery',
    }),
  },
  apollo: {
    $subscribe: {
      changeStatus: {
        query: changeStatus,
        result({ data }) {
          this.$store.commit('ticket/updateTicket', data.ChangeStatus);
        },
      },
      editTicket: {
        query: editTicket,
        variables() {
          return {
            tickets: this.tickets.map((ticket) => ticket.id),
          };
        },
        result({ data }) {
          this.$store.commit('ticket/updateTicket', data.ticket);
        },
      },
      transferToGroup: {
        query: transferToGroup,
        variables() {
          return {
            tickets: this.tickets.map((ticket) => ticket.id),
          };
        },
        result({ data }) {
          this.$store.commit('ticket/updateTicket', data.TransferToGroup);
        },
      },
      slaUpdate: {
        query: slaUpdate,
        variables() {
          return {
            tickets: this.tickets.map((ticket) => ticket.id),
          };
        },
        result({ data }) {
          this.$store.dispatch('ticket/updateSla', data.ticket);
        },
      },
      addNotification: {
        query: addNotification,
        result({ data }) {
          if (data.AddNotification.to.map((to) => to.id).includes(this.user.id)) {
            Notification.requestPermission((permission) => {
              if (permission === 'granted') {
                const notification = new Notification('Notification', {
                  body: data.AddNotification.content,
                });
                notification.onerror = function error() {
                  this.$toast.error('Error');
                };
              }
              this.audio.play();
            });

            this.$store.commit(
              'notification/updateNotification',
              data.AddNotification,
            );
          }
        },
      },
      updateNotification: {
        query: updateNotification,
        result({ data }) {
          this.$store.commit(
            'notification/updateNotification',
            data.UpdateNotification,
          );
        },
      },
      copyTicket: {
        query: copyTicketSubscription,
        result({ data }) {
          this.$store.commit('ticket/insertTicket', data.ticket);
        },
      },
      notifications: {
        query: notifications,
        result({ data }) {
          data.Notification.forEach((notification) => {
            this.$store.commit('notification/updateNotification', notification);
          });
        },
      },
    },
  },
  mounted() {
    this.audio = new Audio('/sounds/open-ended.ogg');
    const miniState = localStorage.getItem('mini');
    if (miniState) this.miniVariant = JSON.parse(miniState);
    if (this.logged) {
      this.processInfo();
    }
  },
  created() {
    this.$store.commit('hotkeys/setHotkeys', [
      'hotkey.profile',
      'ALT + B | Base de conhecimento',
      'ALT + C | Configurações',
      'ALT + N | Notificações',
      'ALT + O | Abrir novo chamado',
    ]);
  },
  methods: {
    toggleMini() {
      this.miniVariant = !this.miniVariant;
      localStorage.setItem('mini', this.miniVariant);
    },
    fetchUrl(item) {
      this.$router.push(`/search/${item.name}`);
    },
    setDialog(ticket) {
      this.$store.commit('ticket/setActualTicket', ticket);
      this.$store.commit('ticket/setDialog', ticket.id);
    },
    copyTicket(value) {
      this.$apollo
        .mutate({
          mutation: copyTicket,
          variables: {
            ticketId: value.id,
          },
          awaitRefetchQueries: true,
          refetchQueries: [
            {
              query: ticketSearch,
              variables: {
                page: parseInt(this.query.page || 1, 10),
                limit: parseInt(this.query.limit || 10, 10),
                descending: parseInt(this.query.descending || -1, 10),
                attributes: {},
              },
            },
          ],
        })
        .then((response) => {
          const { ticket } = response.data;
          this.$store.commit('ticket/setActualTicket', ticket);
          this.$store.commit('ticket/setDialog', ticket.id);
          this.$store.commit('ticket/setConfirmCopy', false);
        });
    },
  },
};
</script>

<style>
.v-badge__badge .v-icon {
  font-size: 14px !important;
}
</style>
