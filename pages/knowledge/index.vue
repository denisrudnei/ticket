<template>
  <v-row>
    <v-col cols="12">
      <knowledge-list />
    </v-col>
  </v-row>
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
