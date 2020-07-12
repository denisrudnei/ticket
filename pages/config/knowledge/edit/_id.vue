<template>
  <create v-model="knowledge" @change="update" />
</template>

<script>
import create from '@/components/knowledge/create'
import CreateKnowledge from '@/graphql/mutation/config/knowledge/create.graphql'
import KnowledgeList from '@/graphql/query/config/knowledge/list.graphql'
import ggl from 'graphql-tag'
export default {
  components: {
    create
  },
  data() {
    return {
      knowledge: null
    }
  },
  asyncData({ app, params }) {
    return app.$apollo
      .query({
        query: ggl(KnowledgeList)
      })
      .then(response => {
        return {
          knowledge: response.data.knowledge
        }
      })
  },
  methods: {
    update(knowledge) {
      this.$apollo
        .mutate({
          mutation: ggl(CreateKnowledge),
          variables: {
            knowledge
          }
        })
        .then(() => {
          this.$toast.show(this.$t('updated'), {
            duration: 5000,
            icon: 'done'
          })
          this.$router.push('/config/knowledge/list')
        })
    }
  }
}
</script>

<style>
</style>
