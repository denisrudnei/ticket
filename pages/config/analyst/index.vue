<template>
  <v-row>
    <v-col
      cols="12"
      pa-3
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
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    headers() {
      return [
        {
          text: this.$t('name'),
          value: 'name'
        }
      ]
    },
    ...mapGetters({
      analysts: 'analyst/getAnalysts'
    })
  },
  created() {}
}
</script>

<style>
</style>
