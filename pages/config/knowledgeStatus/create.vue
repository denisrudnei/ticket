<template>
  <v-row>
    <v-col
      class="pa-2"
      cols="12"
    >
      <v-text-field
        v-model="knowledgeStatus.name"
        filled
        :placeholder="$t('name')"
      />
    </v-col>
    <v-col
      class="pa-2"
      cols="12"
    >
      <v-textarea
        v-model="knowledgeStatus.description"
        filled
        :placeholder="$t('description')"
      />
    </v-col>
    <v-col>
      <v-btn
        class="primary white--text"
        tile
        @click="save(knowledgeStatus)"
      >
        {{ $t('save') }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import create from '@/graphql/mutation/config/knowledgeStatus/create.graphql';
import list from '@/graphql/query/config/knowledgeStatus/list.graphql';
import ggl from 'graphql-tag';

export default {
  data() {
    return {
      knowledgeStatus: {
        name: '',
        description: '',
      },
    };
  },
  methods: {
    save(knowledgeStatus) {
      this.$apollo
        .mutate({
          mutation: ggl(create),
          variables: {
            knowledgeStatus,
          },
          awaitRefetchQueries: true,
          refetchQueries: [{ query: ggl(list) }],
        })
        .then(() => {
          this.$toast.show('Criado', {
            duration: 1000,
          });
          this.$router.push('/config/knowledgeStatus/list');
        });
    },
  },
};
</script>

<style></style>
