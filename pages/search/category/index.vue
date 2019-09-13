<template>
  <v-row>
    <v-treeview
      :items="items"
      :load-children="getSub"
      item-children="subs"
      on-icon="layers"
    >
      <template
        v-slot:prepend="{ item }"
      >
        <v-icon>layers</v-icon>
      </template>
    </v-treeview>
  </v-row>
</template>

<script>
export default {
  asyncData({ $axios }) {
    return $axios.get('/category').then(response => {
      return {
        items: response.data.filter(c => {
          return c.father === null
        })
      }
    })
  },
  methods: {
    getSub(item) {
      this.$axios.get(`/category/${item._id}/subs`).then(response => {
        item.subs = response.data.subs
      })
    }
  }
}
</script>

<style>
</style>
