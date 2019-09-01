<template>
  <v-row>
    <v-col>
      <v-data-table :headers="headers" :items="addresses">
        <template v-slot:item.name="{ item }">
          {{ item.name }}
        </template>
        <template v-slot:item.state="{ item }">
          {{ item.state }}
        </template>
        <template v-slot:item.city="{ item }">
          {{ item.city }}
        </template>
        <template v-slot:item.street="{ item }">
          {{ item.street }}
        </template>
        <template v-slot:item.edit="{ item }">
          <v-btn class="primary white--text" icon :to="`/config/address/edit/${item._id}`">
            <v-icon>edit</v-icon>
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
      addresses: [],
      headers: [
        {
          text: 'Nome',
          value: 'name'
        },
        {
          text: 'Estado',
          value: 'state'
        },
        {
          text: 'Cidade',
          value: 'city'
        },
        {
          text: 'Rua',
          value: 'street'
        },
        {
          text: 'Editar',
          value: 'edit'
        }
      ]
    }
  },
  created() {
    this.$axios.get('/address').then(response => {
      this.addresses = response.data
    })
  }
}
</script>

<style>
</style>
