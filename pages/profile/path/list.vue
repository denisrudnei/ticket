<template>
  <v-row>
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="items"
      >
        <template #item.name="{ item }">
          {{ item.name }}
        </template>
        <template #item.property="{ item }">
          {{ item.property }}
        </template>
        <template #item.actions="{ item }">
          <v-btn
            class="primary white--text"
            icon
            title="Exluir"
            @click="deletePath(item.id)"
          >
            <v-icon>
              delete
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';

import remove from '@/graphql/mutation/profile/path/removePath';
import list from '@/graphql/query/profile/path/list';
import getTree from '@/graphql/query/profile/path/tree';

export default {
  asyncData({ app }) {
    return app.apolloProvider.defaultClient
      .query({
        query: list,
      })
      .then((response) => ({
        items: response.data.path,
      }));
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t('name'),
          value: 'name',
        },
        {
          text: this.$t('field'),
          value: 'property',
        },
        {
          text: this.$t('actions'),
          value: 'actions',
        },
      ];
    },
    user() {
      return this.$auth.user;
    },
    ...mapGetters({
      tree: 'ticket/getTree',
    }),
  },
  methods: {
    deletePath(id) {
      this.$apollo
        .mutate({
          mutation: remove,
          variables: {
            userId: this.user.id,
            path: id,
          },
          awaitRefetchQueries: true,
          refetchQueries: [
            {
              query: getTree,
            },
            {
              query: list,
            },
          ],
        })
        .then(() => {
          this.items = this.items.filter((item) => item.id !== id);
          this.$store.commit(
            'ticket/setTree',
            this.tree.filter((item) => item.id !== id),
          );
          this.$toast.show('Removido', {
            duration: 5000,
            icon: 'done',
          });
        });
    },
  },
};
</script>

<style></style>
