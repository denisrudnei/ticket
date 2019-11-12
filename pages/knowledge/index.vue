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
  computed: {
    headers() {
      return [
        {
          text: 'Id',
          value: 'id'
        },
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
