<template>
  <v-row>
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="items"
      >
        <template
          v-slot:item.name="{ item }"
        >
          {{ item.name }}
        </template>
        <template v-slot:item.property="{ item }">
          {{ item.property }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn class="primary white--text" icon title="Exluir" @click="deletePath(item.id)">
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
import { mapGetters } from 'vuex'
import ggl from 'graphql-tag'
import remove from '@/graphql/mutation/profile/path/removePath.graphql'
import list from '@/graphql/query/profile/path/list.graphql'
import getTree from '@/graphql/query/profile/path/tree.graphql'
export default {
  computed: {
    headers() {
      return [
        {
          text: this.$t('name'),
          value: 'name'
        },
        {
          text: this.$t('field'),
          value: 'property'
        },
        {
          text: this.$t('actions'),
          value: 'actions'
        }
      ]
    },
    ...mapGetters({
      user: 'auth/getUser',
      tree: 'ticket/getTree'
    })
  },
  asyncData({ app }) {
    return app.$apollo
      .query({
        query: ggl(list)
      })
      .then(response => {
        return {
          items: response.data.path
        }
      })
  },
  methods: {
    deletePath(id) {
      this.$apollo
        .mutate({
          mutation: ggl(remove),
          variables: {
            userId: this.user.id,
            path: id
          },
          refetchQueries: [
            {
              query: ggl(getTree)
            },
            {
              query: ggl(list)
            }
          ]
        })
        .then(() => {
          this.items = this.items.filter(item => {
            return item.id !== id
          })
          this.$store.commit(
            'ticket/setTree',
            this.tree.filter(item => {
              return item.id !== id
            })
          )
          this.$toast.show('Removido', {
            duration: 5000,
            icon: 'done'
          })
        })
    }
  }
}
</script>

<style>
</style>
