<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
    >
      <v-data-table
        :headers="headers"
        :items="items"
      >
        <template
          slot="items"
          slot-scope="data"
        >
          <td>{{ data.item.fullName }}</td>
          <td>{{ data.item.father !== undefined ? data.item.father.fullName : 'orfão' }}</td>
          <td>{{ data.item.subs !== undefined ? data.item.subs.length : 0 }}</td>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
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
          text: 'Categoria pai',
          value: 'father'
        },
        {
          text: 'Quantidade de filhas',
          value: 'children'
        }
      ],
      items: []
    }
  },
  created() {
    this.$axios.get('api/category').then(response => {
      this.items = response.data
    })
  }
}
</script>

<style>
</style>
