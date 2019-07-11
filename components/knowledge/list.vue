<template>
  <v-data-table
    :headers="headers"
    :items="items"
    pagination.sync="pagination"
  >
    <template v-slot:items="{ item }">
      <td>
        <nuxt-link :to="`/knowledge/view/${item._id}`">
          {{ item.name }}
        </nuxt-link>
      </td>
      <td>{{ item.created | date }}</td>
      <td>{{ item.status }}</td>
    </template>
  </v-data-table>
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
          text: 'Data de criação',
          value: 'created'
        },
        {
          text: 'Status',
          value: 'status'
        }
      ],
      items: []
    }
  },
  watch: {
    $route(newValue) {
      this.$axios
        .get(`/knowledge/bycategory/${newValue.params.id}`)
        .then(response => {
          this.items = response.data
        })
    }
  },
  created() {
    this.$axios.get('/knowledge').then(response => {
      this.items = response.data
    })
  }
}
</script>

<style>
</style>
