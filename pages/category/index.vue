<template>
  <v-layout
    row
    wrap
  >
    <!-- <pre>
      {{ items }}
    </pre> -->
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
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      items: []
    }
  },
  created() {
    this.$axios.get('api/category').then(response => {
      this.items = response.data.filter(c => {
        return c.father === undefined
      })
    })
  },
  methods: {
    getSub(item) {
      this.$axios.get(`api/category/${item._id}/subs`).then(response => {
        item.subs = response.data.subs
      })
    }
  }
}
</script>

<style>
</style>
