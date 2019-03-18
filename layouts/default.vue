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
        v-if="logged"
        flat
        icon
        class="primary white--text"
        to="/profile"
      >
        <v-icon>
          person
        </v-icon>
      </v-btn>
      <Notification />
      <v-btn
        v-if="logged"
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
      <v-btn
        v-if="logged"
        to="/auth/logout"
        title="Fazer logoff"
        icon
        flat
        class="primary white-text"
      >
        <v-icon>
          exit_to_app
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
      <nuxt />
    </v-content>
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
import { mapGetters } from 'vuex'
import Notification from '@/components/notification'

export default {
  components: {
    Notification
  },
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: true,
      items: [{ icon: 'bookmarks', title: 'Chamados', to: '/' }],
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
  computed: {
    ...mapGetters({
      tickets: 'ticket/getTickets',
      logged: 'auth/getLoggedIn',
      user: 'auth/getUser'
    })
  },
  async fetch({ store }) {
    await this.$axios.get('api/ticket').then(response => {
      store.commit('ticket/setTickets', response.data)
    })
    await this.$axios.get('api/status').then(response => {
      store.commit('status/setStatus', response.data)
    })
    await this.$axios.get('api/group').then(response => {
      store.commit('group/setGroups', response.data)
    })
  },
  async created() {
    this.updateTree()

    if (this.user !== undefined) {
      await this.$axios.post('api/auth/mergeUser', this.user).then(response => {
        this.$store.commit('auth/setUserId', response.data._id)
      })
      await this.$axios
        .post(`api/notification/${this.user._id}`)
        .then(response => {
          this.$store.commit('notification/setNotifications', response.data)
        })
    }
  },
  mounted() {
    this.$socket.on('notification', notification => {
      // this.$store.dispatch('ticket/insertTicket', ticket)
      // this.updateTree()
      this.$store.commit('notification/addNotification', notification)
    })

    this.$socket.on('readNotification', notification => {
      this.$store.commit('notification/updateNotification', notification)
    })

    this.$socket.on('updateTicket', ticket => {
      this.$store.commit('ticket/updateTicket', ticket)
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
      if (!data.length > 0) return
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
