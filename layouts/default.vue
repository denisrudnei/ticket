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

export default {
  data() {
    return {
      logged: true,
      clipped: true,
      drawer: true,
      fixed: true,
      items: [
        // TODO
        { icon: 'apps', title: 'Home', to: '/' },
        { icon: 'bookmarks', title: 'Chamados', to: '/ticket' },
        { icon: 'layers', title: 'Categorias', to: '/category' },
        { icon: 'settings_applications', title: 'Configurações', to: '/config' }
      ],
      tree: [],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'CControl'
    }
  },
  created() {
    this.$axios.get('api/ticket').then(response => {
      this.addToTree('Status', 'status.name', response.data)
      this.addToTree('Grupo', 'group.name', response.data)
      this.addToTree('Categoria', 'category.name', response.data)
    })
  },
  methods: {
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
