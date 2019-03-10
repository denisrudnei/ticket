<template>
  <v-layout
    row
    wrap
  >
    <v-data-table
      :items="analysts"
    >
      <template
        slot="items"
        slot-scope="data"
      >
        <td>{{ data.item.name }}</td>
      </template>
    </v-data-table>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      analysts: []
    }
  },
  created() {}
}
</script>

<style>
</style>
