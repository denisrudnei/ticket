<template>
  <v-layout row wrap>
    <v-flex xs12>
      <knowledge-list />
    </v-flex>
  </v-layout>
</template>

<script>
import KnowledgeList from '@/components/knowledge/list'
export default {
  components: {
    KnowledgeList
  },
  data() {
    return {
      headers: [
        {
          text: 'Id',
          value: 'id'
        },
        {
          text: 'Nome',
          value: 'name'
        },
        {
          text: 'Data de criação',
          value: 'created'
        },
        {
          text: 'Status',
          value: 'status'
        }
      ]
    }
  },
  asyncData({ $axios }) {
    return $axios.get('/knowledge/').then(response => {
      return {
        items: response.data
      }
    })
  }
}
</script>

<style>
</style>
