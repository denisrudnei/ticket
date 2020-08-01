<template>
  <v-row>
    <v-col cols="12">
      <knowledge-list />
    </v-col>
  </v-row>
</template>

<script>
import KnowledgeList from '@/components/knowledge/list';

export default {
  components: {
    KnowledgeList,
  },
};
</script>

<style></style>
