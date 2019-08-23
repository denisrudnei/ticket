<template>
  <v-data-table
    :headers="headers"
    :items="items"
    pagination.sync="pagination"
  >
    <template v-slot:item.name="{ item }">
      <nuxt-link :to="`/knowledge/view/${item._id}`">
        {{ item.name }}
      </nuxt-link>
    </template>
    <template v-slot:item.created="{ item }">
      {{ item.created | date }}
    </template>
    <template v-slot:item.status="{ item }">
      {{ item.status }}
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
      if (newValue.params.id) {
        this.$axios
          .get(`/knowledge/group/${newValue.params.id}`)
          .then(response => {
            this.items = response.data
          })
      }
    }
  },
  created() {
    const url =
      this.$route.params.id !== undefined
        ? `/knowledge/group/${this.$route.params.id}`
        : '/knowledge'
    this.$axios.get(url).then(response => {
      this.items = response.data
    })
  }
}
</script>

<style>
</style>
