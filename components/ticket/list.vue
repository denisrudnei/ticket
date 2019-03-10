<template>
  <v-data-table
    :items="tickets"
    :search="search"
    :headers="headers"
  >
    <template
      slot="items"
      slot-scope="data"
    >
      <td>
        <nuxt-link
          :to="`/ticket/${data.item._id}`"
        >
          {{ data.item.actualUser.name }}
        </nuxt-link>
      </td>
      <td>{{ data.item.status.name }}</td>
      <td>{{ data.item.group.name }}</td>
      <td>{{ data.item.category.fullName }}</td>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    tickets: {
      type: Array
    },
    search: {
      type: String
    }
  },
  data() {
    return {
      headers: [
        {
          text: 'Usuário atual',
          value: 'actualUser'
        },
        {
          text: 'Status',
          value: 'status'
        },
        {
          text: 'Grupo',
          value: 'group'
        },
        {
          text: 'Categoria',
          value: 'category'
        }
      ]
    }
  }
}
</script>
