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
  }
}
</script>

<style>
</style>
