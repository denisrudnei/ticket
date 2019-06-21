<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-data-table
        :headers="headers"
        :items="tree"
      >
        <template
          v-slot:items="{ item }"
        >
          <td>{{ item.name }}</td>
          <td>{{ item.id }}</td>
          <td>
            <v-btn class="primary white--text" icon title="Exluir" @click="deletePath(item._id)">
              <v-icon>
                delete
              </v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      headers: [
        {
          text: 'Nome',
          value: 'name'
        },
        {
          text: 'Campo',
          value: 'field'
        },
        {
          text: 'Ações',
          value: 'actions'
        }
      ]
    }
  },
  computed: mapGetters({
    tree: 'ticket/getTree'
  }),
  methods: {
    deletePath(id) {
      this.$axios.delete(`/info/path/${id}`).then(() => {
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
