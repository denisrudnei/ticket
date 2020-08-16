<template>
  <v-app-bar
    fixed
    :app="app"
    clipped-right
    clipped-left
    class="primary white--text"
  >
    <v-btn
      to="/"
      icon
      class="primary white--text"
    >
      <v-icon>
        home
      </v-icon>
    </v-btn>
    <v-spacer />
    <v-text-field
      v-if="logged"
      v-model="id"
      type="number"
      :placeholder="$t('search')"
      prepend-icon="search"
      color="white"
      single-line
      hide-details
      append-outer-icon="clear"
      flat
      solo
      @click:append-outer="clearText"
      @click:prepend="search(id)"
      @keypress.enter="search(id)"
    />
    <v-dialog
      v-model="ticketNotFound"
      width="50vw"
    >
      <v-card>
        <v-card-content>
          <v-row>
            <v-col>
              {{ $t('ticket_not_found') }}
            </v-col>
          </v-row>
        </v-card-content>
      </v-card>
    </v-dialog>
    <v-menu
      v-if="logged && isMobile"
      :close-on-content-click="false"
      class=".d-flex .d-sm-none"
      :nudge-width="250"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          text
          class="primary white--text"
          v-on="on"
        >
          <v-icon>
            view_module
          </v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="option in options"
          :key="option.text"
          :to="option.to"
          exact
        >
          <v-list-item-action>
            <v-icon>
              {{ option.icon }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            {{ $t(option.text) }}
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
    <template v-if="logged && !isMobile">
      <v-btn
        v-for="option in options"
        :key="option.text"
        icon
        class="primary white--text"
        :title="$t(option.text)"
        :to="option.to"
      >
        <v-icon>{{ option.icon }}</v-icon>
      </v-btn>
    </template>
    <Notification v-if="logged" />
    <language />
    <v-btn
      v-if="logged"
      title="Fazer logoff"
      icon
      text
      class="white-text"
      @click="logout()"
    >
      <v-icon class="white--text">
        exit_to_app
      </v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { mapGetters } from 'vuex';
import Notification from '@/components/notification';
import Language from '@/components/language';
import id from '@/graphql/query/toolbar/ticketNumber.graphql';
import ggl from 'graphql-tag';
import addTicketsToEdit from '@/mixins/addTicketToEdit';

export default {
  components: {
    Notification,
    Language,
  },
  mixins: [addTicketsToEdit],
  props: {
    app: {
      type: Boolean,
      default: true,
    },
    logged: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isMobile: false,
      id: '',
      ticketNotFound: false,
      options: [
        {
          title: 'profile',
          text: 'profile',
          icon: 'person',
          to: '/profile',
        },
        {
          title: 'API',
          text: 'API',
          icon: 'format_shapes',
          to: '/config/playground',
        },
        {
          title: 'configurations',
          text: 'configurations',
          icon: 'settings_applications',
          to: '/config',
        },
      ],
    };
  },
  computed: mapGetters({
    user: 'auth/getUser',
  }),
  mounted() {
    const lang = localStorage.getItem('language');
    if (lang) {
      this.$store.commit('locale/setLocale', lang);
      this.$i18n.locale = lang;
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.onResize, { passive: true });
    }
  },
  beforeDestroy() {
    this.onResize();
    window.removeEventListener('resize', this.onResize, { passive: true });
  },
  methods: {
    search(idToSearch) {
      this.$apollo
        .query({
          query: ggl(id),
          variables: {
            ids: [idToSearch],
          },
        })
        .then((response) => {
          const tickets = response.data.SearchByIds.docs;
          if (tickets.length === 0) {
            this.ticketNotFound = true;
          } else {
            this.addTicketsToEdit(tickets[0]);
          }
        });
    },
    clearText() {
      this.id = '';
    },
    logout() {
      this.$store.commit('logout/setLogout', true);
    },
    onResize() {
      this.isMobile = window.innerWidth < 600;
    },
  },
};
</script>

<style></style>
