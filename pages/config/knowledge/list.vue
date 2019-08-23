<template>
  <v-row>
    <v-col cols="12">
      <v-data-table :items="items" :headers="headers">
        <template v-slot:item.name="{item}">
          {{ item.name }}
        </template>
        <template v-slot:item.actions="{item}">
          <v-btn class="primary white--text" icon :to="`/config/knowledge/edit/${item._id}`">
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn class="primary white--text" icon @click="remove(item)">
            <v-icon>delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: 'Nome',
          value: 'name'
        },
        {
          text: 'Ações',
          value: 'actions'
        }
      ]
    }
  },
  asyncData({ $axios }) {
    return $axios.get('/knowledge/all').then(response => {
      return {
        items: response.data
      }
    })
  },
  methods: {
    remove(item) {
      this.$axios.delete(`/knowledge/${item._id}`).then(() => {
        this.items = this.items.filter(i => {
          return i._id !== item._id
        })
        this.$toast.show('Apagado', {
          duration: 5000,
          icon: 'delete'
        })
      })
    }
  }
}
</script>

<style>
</style>
