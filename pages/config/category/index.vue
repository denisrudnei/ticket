<template>
  <v-row>
    <v-col
      cols="12"
    >
      <v-data-table
        :headers="headers"
        :items="items"
      >
        <template
          v-slot:item.name="{ item }"
        >
          {{ item.fullName }}
        </template>
        <template v-slot:item.father="{ item }">
          {{ (item.father !== undefined && item.father !== null) ? item.father.fullName : 'orfão' }}
        </template>
        <template v-slot:item.group="{ item }">
          {{ !item.defaultGroup ? '' : item.defaultGroup.name }}
        </template>
        <template v-slot:item.children="{ item }">
          {{ item.subs !== undefined ? item.subs.length : 0 }}
        </template>
        <template v-slot:item.edit="{ item }">
          <v-btn icon class="primary white--text" :to="`/config/category/edit/${item.name}`">
            <v-icon>edit</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import ggl from 'graphql-tag'
import categoryList from '@/graphql/query/config/category/categoryList.graphql'
export default {
  computed: {
    headers() {
      return [
        {
          text: this.$t('name'),
          value: 'name'
        },
        {
          text: 'Categoria pai',
          value: 'father'
        },
        {
          text: 'Quantidade de filhas',
          value: 'children'
        },
        {
          text: this.$t('group'),
          value: 'group'
        },
        {
          text: this.$t('edit'),
          value: 'edit'
        }
      ]
    }
  },
  asyncData({ params, app }) {
    return app.$apollo
      .query({
        query: ggl(categoryList),
        variables: {
          name: params.name
        }
      })
      .then(response => {
        return {
          items: response.data.category
        }
      })
  }
}
</script>

<style>
</style>
