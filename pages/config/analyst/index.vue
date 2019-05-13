<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
      pa-2
    >
      <v-data-table
        :items="analysts"
        :headers="headers"
      >
        <template
          slot="items"
          slot-scope="data"
        >
          <td>{{ data.item.name }}</td>
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
        }
      ]
    }
  },
  computed: mapGetters({
    analysts: 'analyst/getAnalysts'
  }),
  created() {}
}
</script>

<style>
</style>
