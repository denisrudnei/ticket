<template>
  <v-row>
    <v-col cols="12">
      <v-data-table :items="items" :headers="headers">
        <template v-slot:item.name="{item}">
          {{ item.name }}
        </template>
        <template v-slot:item.actions="{item}">
          <v-btn class="primary white--text" icon :to="`/config/knowledge/edit/${item.id}`">
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn class="primary white--text" icon @click="remove(item)">
            <v-icon>delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import KnowledgeList from '@/graphql/query/knowledge/list.graphql'
import RemoveKnowledge from '@/graphql/mutation/config/knowledge/remove.graphql'
import ggl from 'graphql-tag'
export default {
  computed: {
    headers() {
      return [
        {
          text: this.$t('name'),
          value: 'name'
        },
        {
          text: this.$t('actions'),
          value: 'actions'
        }
      ]
    }
  },
  asyncData({ app }) {
    return app.$apollo
      .query({
        query: ggl(KnowledgeList)
      })
      .then(response => {
        return {
          items: response.data.knowledge
        }
      })
  },
  methods: {
    remove(item) {
      this.$apollo
        .mutate({
          mutation: ggl(RemoveKnowledge)
        })
        .then(() => {
          this.items = this.items.filter(i => {
            return i.id !== item.id
          })
          this.$toast.show('Apagado', {
            duration: 5000,
            icon: 'delete'
          })
        })
    }
  }
}
</script>

<style>
</style>
