<template>
  <v-row>
    <v-col
      cols="4"
      pa-3
    >
      <v-select
        v-model="selected"
        filled
        :items="paths.map((v) => ({ text: $t(v.objectName), value: v }))"
      />
    </v-col>
    <v-col
      cols="4"
      pa-3
    >
      <v-select
        v-model="selected.property"
        :disabled="selected.options <= 0"
        filled
        :items="selected.options.map((v) => ({ text: $t(v), value: v }))"
      />
    </v-col>
    <v-col
      cols="4"
      pa-3
    >
      <v-text-field
        v-model="selected.name"
        :disabled="selected.objectName === ''"
        filled
        placeholder="Nome na listagem"
      />
    </v-col>
    <v-col pa-3>
      <v-btn
        class="primary white--text"
        :disabled="selected.name === ''"
        @click="save()"
      >
        <v-icon left>
          save
        </v-icon>
        {{ $t('save') }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>

import ref from '@/graphql/query/profile/path/ref';
import add from '@/graphql/mutation/profile/path/add';
import tree from '@/graphql/query/profile/path/tree';
import list from '@/graphql/query/profile/path/list';

export default {
  asyncData({ app }) {
    return app.apolloProvider.defaultClient
      .query({
        query: ref,
      })
      .then((response) => ({
        paths: response.data.ref,
      }));
  },
  data() {
    return {
      selected: {
        options: [],
        objectName: '',
        property: '',
        name: '',
      },
    };
  },
  methods: {
    save() {
      this.$apollo
        .mutate({
          mutation: add,
          variables: {
            path: {
              name: this.selected.name,
              objectName: this.selected.objectName,
              property: this.selected.property,
            },
          },
          awaitRefetchQueries: true,
          refetchQueries: [
            {
              query: list,
            },
            {
              query: tree,
            },
          ],
        })
        .then((response) => {
          this.$store.commit('ticket/addTreeItem', response.data.path);
          this.$toast.show('Cadastrado', {
            duration: 5000,
          });
        });
    },
  },
};
</script>

<style></style>
