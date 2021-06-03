<template>
  <ApolloQuery :query="treeQuery">
    <template #default="{ result: { data } }">
      <v-treeview
        v-if="data"
        :items="data.tree"
        open-on-click

        item-key="name"
        activatable
        transition
      >
        <template #prepend="{ item }">
          <v-icon v-if="item.url">
            layers
          </v-icon>
        </template>
        <template #label="{ item }">
          <span v-show="false">{{ item.url }}</span>
          <span v-if="!item.url">{{ item.name }}</span>
          <nuxt-link
            v-if="item.url"
            exact
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
import tree from '@/graphql/query/profile/path/tree';
import removePath from '@/graphql/subscription/path/removePath';
import add from '@/graphql/subscription/path/add';

export default {
  computed: {
    treeQuery() {
      return tree;
    },
    user() {
      return this.$auth.user;
    },
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
