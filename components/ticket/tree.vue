<template>
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
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: mapGetters({
    tree: 'ticket/getTree'
  }),
  created() {
    this.$axios.get('/info/path').then(response => {
      this.$store.commit('ticket/setTree', response.data)
    })
  }
}
</script>

<style>
</style>
