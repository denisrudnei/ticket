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
import category from '@/graphql/query/search/category/category.graphql'
import getSubs from '@/graphql/query/search/category/subs.graphql'
export default {
  asyncData({ $axios }) {
    return $axios
      .post('/graphql', {
        query: category
      })
      .then(response => {
        return {
          items: response.data.data.Category.filter(c => {
            return c.father === null
          })
        }
      })
  },
  methods: {
    getSub(item) {
      this.$apollo
        .query({
          query: getSubs,
          variables: {
            categoryId: item._id
          }
        })
        .then(response => {
          return response.data.GetSubs
        })
    }
  }
}
</script>

<style>
</style>
