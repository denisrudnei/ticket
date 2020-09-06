<template>
  <ApolloQuery :query="treeQuery">
    <template v-slot="{ result: { loading, error, data } }">
      <v-treeview
        v-if="data"
        :items="data.tree"
        open-on-click
        item-key="id"
        activatable
      >
        <template v-slot:prepend="{ item }">
          <v-icon v-if="item.children.length === 0">
            layers
          </v-icon>
        </template>
        <template v-slot:label="{ item }">
          <span v-if="item.children.length > 0">{{ item.name }}</span>
          <nuxt-link
            v-if="item.children.length === 0"
            :to="item.url"
          >
            {{ item.name }}
          </nuxt-link>
        </template>
      </v-treeview>
    </template>
  </ApolloQuery>
</template>

<script>
import { mapGetters } from 'vuex';

import tree from '@/graphql/query/profile/path/tree';
import removePath from '@/graphql/subscription/path/removePath';
import add from '@/graphql/subscription/path/add';

export default {
  computed: {
    treeQuery() {
      return tree;
    },
    ...mapGetters({
      user: 'auth/getUser',
    }),
  },
  apollo: {
    $subscribe: {
      RemovePath: {
        query: removePath,
        variables() {
          return {
            userId: this.user.id,
          };
        },
        result({ data }) {
          this.$store.commit('ticket/removeTreeItem', data.path);
        },
      },
      NewPath: {
        query: add,
        variables() {
          return {
            userId: this.user.id,
          };
        },
        result({ data }) {
          this.$store.commit('ticket/addTreeItem', data.pathItem);
        },
      },
    },
  },
};
</script>

<style></style>
