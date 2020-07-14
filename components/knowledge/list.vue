<template>
  <v-data-table
    :headers="headers"
    :items="items"
    pagination.sync="pagination"
  >
    <template v-slot:item.name="{ item }">
      <nuxt-link :to="`/knowledge/view/${item.id}`">
        {{ item.name }}
      </nuxt-link>
    </template>
    <template v-slot:item.created="{ item }">
      {{ item.created | date }}
    </template>
    <template v-slot:item.status="{ item }">
      {{ item.status.name }}
    </template>
  </v-data-table>
</template>

<script>
import ggl from 'graphql-tag'
import KnowledgeListByGroup from '@/graphql/query/knowledge/listByGroup.graphql'
import KnowledgeListAll from '@/graphql/query/knowledge/list.graphql'
export default {
  data() {
    return {
      items: []
    }
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t('name'),
          value: 'name'
        },
        {
          text: this.$t('creation_date'),
          value: 'created'
        },
        {
          text: this.$t('status'),
          value: 'status'
        }
      ]
    }
  },
  watch: {
    $route(newValue) {
      if (newValue.params.groupName) {
        this.$apollo
          .query({
            query: ggl(KnowledgeListByGroup),
            variables: {
              groupName: newValue.params.groupName
            }
          })
          .then(response => {
            this.items = response.data.knowledge
          })
      }
    }
  },
  mounted() {
    const groupName = this.$route.params.groupName
    const query = groupName ? KnowledgeListByGroup : KnowledgeListAll
    this.$apollo
      .query({
        query: ggl(query),
        variables: {
          groupName: groupName
        }
      })
      .then(response => {
        this.items = response.data.knowledge
      })
  }
}
</script>

<style>
</style>
