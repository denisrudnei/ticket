<template>
  <v-row>
    <v-col>
      <v-treeview
        :items="items"
        item-children="subs"
        on-icon="layers"
        open-on-click
      >
        <template
          v-slot:prepend="{ item }"
        >
          <v-icon>layers</v-icon>
        </template>
        <template v-slot:label="{item}">
          <span @click="getSub(item)">
            {{ item.name }}
          </span>
        </template>
      </v-treeview>
    </v-col>
  </v-row>
</template>

<script>
import ggl from 'graphql-tag'
import category from '@/graphql/query/search/category/category.graphql'
import getSubs from '@/graphql/query/search/category/subs.graphql'
export default {
  asyncData({ app }) {
    return app.$apollo
      .query({
        query: ggl(category)
      })
      .then(response => {
        return {
          items: response.data.category.filter(c => {
            return c.father === null
          })
        }
      })
  },
  methods: {
    getSub(item) {
      this.$apollo
        .query({
          query: ggl(getSubs),
          variables: {
            categoryId: item._id
          }
        })
        .then(response => {
          return response.data.category
        })
    }
  }
}
</script>

<style>
</style>
