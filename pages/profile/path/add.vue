<template>
  <v-row>
    <v-col cols="4" pa-3>
      <v-select
        v-model="selected"
        filled
        :items="paths.map(v => ({text: v.objectName, value: v}))"
      />
    </v-col>
    <v-col cols="4" pa-3>
      <v-select
        v-model="selected.property"
        :disabled="selected.options <= 0"
        filled
        :items="selected.options.map(v => ({text: v, value: v}))"
      />
    </v-col>
    <v-col cols="4" pa-3>
      <v-text-field
        v-model="selected.name"
        :disabled="selected.objectName === ''"
        filled
        placeholder="Nome na listagem"
      />
    </v-col>
    <v-btn class="primary white--text" :disabled="selected.name === ''" @click="save()">
      <v-icon left>
        save
      </v-icon>
      Salvar
    </v-btn>
  </v-row>
</template>

<script>
import ggl from 'graphql-tag'
import ref from '@/graphql/query/profile/path/ref.graphql'
import add from '@/graphql/mutation/profile/path/add.graphql'
import tree from '@/graphql/query/profile/path/tree.graphql'
import list from '@/graphql/query/profile/path/list.graphql'
export default {
  data() {
    return {
      selected: {
        options: [],
        objectName: '',
        property: '',
        name: ''
      }
    }
  },
  asyncData({ app, $axios }) {
    return app.$apollo
      .query({
        query: ggl(ref)
      })
      .then(response => {
        return {
          paths: response.data.ref
        }
      })
  },
  methods: {
    save() {
      this.$apollo
        .mutate({
          mutation: ggl(add),
          variables: {
            path: {
              name: this.selected.name,
              objectName: this.selected.objectName,
              property: this.selected.property
            }
          },
          refetchQueries: [
            {
              query: ggl(list)
            },
            {
              query: ggl(tree)
            }
          ]
        })
        .then(response => {
          this.$store.commit('ticket/addTreeItem', response.data.path)
          this.$toast.show('Cadastrado', {
            duration: 5000
          })
        })
    }
  }
}
</script>

<style>
</style>
