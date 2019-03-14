<template>
  <v-app>
    <v-navigation-drawer
      v-if="logged"
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      permanent
      app
    >
      <v-list>
        <v-list-tile
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon" />
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-spacer />
      <v-treeview
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
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="clipped"
      fixed
      app
      class="primary white--text"
    >
      <v-btn
        v-if="logged"
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon
          v-html="miniVariant ? 'chevron_right' : 'chevron_left'"
        />
      </v-btn>
      <v-toolbar-title
        v-text="title"
      />
      <v-spacer />
      <v-btn
        flat
        icon
        class="primary white--text"
        to="/profile"
      >
        <v-icon>
          person
        </v-icon>
      </v-btn>
      <v-menu
        :nudge-width="200"
        offset-y
      >
        <template
          v-slot:activator="{ on }"
        >
          <v-btn
            icon
            flat
            v-on="on"
          >
            <v-badge>
              <template
                v-slot:badge
              >
                <span>{{ notifications.length }}</span>
              </template>
              <v-icon
                class="white--text"
              >
                notifications
              </v-icon>
            </v-badge>
          </v-btn>
        </template>
        <v-list>
          <v-list-tile
            v-for="(notification, index) in notifications"
            :key="index"
          >
            <!-- <v-list-tile-title>-->
            <v-btn
              flat
              block
              :to="`/notification/${notification._id}`"
            >
              {{ notification.content }}
            </v-btn>
            <!-- </v-list-tile-title>-->
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-btn
        flat
        title="Configurações"
        to="/config"
        class="white--text"
      >
        Configurações
        <v-icon
          right
          class="white--text"
        >
          settings_applications
        </v-icon>
      </v-btn>
    </v-toolbar>
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
            md3
            pa-2
          >
            <v-btn
              to="/ticket/create"
              class="primary"
            >
              Criar incidente
            </v-btn>
          </v-flex>
          <v-flex
            xs12
            md3
            pa-2
          >
            <v-btn
              to="/search"
              class="primary"
            >
              Pesquisar
            </v-btn>
          </v-flex>
        </template>
      </v-layout>
      <!--<v-container>-->
      <nuxt />
      <!--</v-container>-->
    </v-content>
    <v-snackbar
      bottom
      right
    >
      Texto de mensagem aqui
    </v-snackbar>
    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import _ from 'lodash'
import io from 'socket.io-client'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      logged: true,
      clipped: true,
      drawer: true,
      fixed: true,
      items: [
        // TODO
        { icon: 'bookmarks', title: 'Chamados', to: '/' },
        { icon: 'layers', title: 'Categorias', to: '/category' }
      ],
      tree: [],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'CControl',
      treeInfo: [
        {
          name: 'Status',
          group: 'status.name'
        },
        {
          name: 'Grupo',
          group: 'group.name'
        },
        {
          name: 'Categoria',
          group: 'category.name'
        }
      ]
    }
  },
  computed: mapGetters({
    notifications: 'notification/getNotifications',
    tickets: 'ticket/getTickets'
  }),
  async fetch({ store, params }) {
    const id = '5c4c6e95a5fdb240e75c8268'
    await this.$axios.post(`api/notification/${id}`).then(response => {
      store.commit('notification/setNotifications', response.data)
    })
  },
  created() {
    this.$axios.get('api/ticket').then(response => {
      this.$store.commit('ticket/setTickets', response.data)
      this.updateTree()
    })
    const socket = io()
    socket.on('notification', notification => {
      // this.$store.dispatch('ticket/insertTicket', ticket)
      // this.tickets.push(ticket)
      // this.updateTree()
      this.notifications.push(notification)
    })
    const id = '5c4c6e95a5fdb240e75c8268'
    this.$axios.post(`api/notification/${id}`).then(response => {
      this.$store.commit('notification/setNotifications', response.data)
    })
  },
  methods: {
    updateTree() {
      this.tree = []
      this.treeInfo.forEach(leaf => {
        this.addToTree(leaf.name, leaf.group, this.tickets)
      })
    },
    fetchUrl(item) {
      this.$router.push('/search/' + item.name)
    },
    addToTree(name, groupBy, data) {
      const base = _(data)
        .groupBy(groupBy)
        .value()

      const result = Object.keys(base).map(k => ({
        id: `${k} - ${base[k].length}`,
        name: `${k} - ${base[k].length}`,
        url: `/search?${groupBy}=${k}`,
        children: []
      }))

      this.tree.push({
        id: groupBy,
        name: name,
        children: result
      })
    }
  }
}
</script>
