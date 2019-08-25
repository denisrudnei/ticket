<template>
  <v-row>
    <v-col
      cols="12"
    >
      <v-data-table
        :headers="headers"
        :items="items"
      >
        <template
          v-slot:item.name="{ item }"
        >
          {{ item.fullName }}
        </template>
        <template v-slot:item.father="{ item }">
          {{ (item.father !== undefined && item.father !== null) ? item.father.fullName : 'orfão' }}
        </template>
        <template v-slot:item.children="{ item }">
          {{ item.subs !== undefined ? item.subs.length : 0 }}
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
    this.$axios.get('/category').then(response => {
      this.items = response.data
    })
  }
}
</script>

<style>
</style>
