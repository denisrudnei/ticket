<template>
  <v-row>
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="tree"
      >
        <template
          v-slot:item.name="{ item }"
        >
          {{ item.name }}
        </template>
        <template v-slot:item.field="{ item }">
          {{ item.id }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn class="primary white--text" icon title="Exluir" @click="deletePath(item._id)">
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
