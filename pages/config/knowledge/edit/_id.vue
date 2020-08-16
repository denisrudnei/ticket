<template>
  <create
    v-model="knowledge"
    @change="update"
  />
</template>

<script>
import create from '@/components/knowledge/create';
import CreateKnowledge from '@/graphql/mutation/config/knowledge/create.graphql';
import KnowledgeList from '@/graphql/query/config/knowledge/knowledgeById.graphql';
import ggl from 'graphql-tag';

export default {
  components: {
    create,
  },
  asyncData({ app, params }) {
    return app.$apollo
      .query({
        query: ggl(KnowledgeList),
        variables: {
          id: params.id,
        },
      })
      .then((response) => ({
        knowledge: response.data.knowledge,
      }));
  },
  data() {
    return {
      knowledge: null,
    };
  },
  methods: {
    update(knowledge) {
      this.$apollo
        .mutate({
          mutation: ggl(CreateKnowledge),
          variables: {
            id: knowledge.id,
            knowledge: {
              name: knowledge.name,
              description: knowledge.description,
              group: knowledge.group.id,
              category: knowledge.category.id,
              status: knowledge.status.id,
            },
          },
        })
        .then(() => {
          this.$toast.show(this.$t('updated'), {
            duration: 5000,
            icon: 'done',
          });
          this.$router.push('/config/knowledge/list');
        });
    },
  },
};
</script>

<style></style>
