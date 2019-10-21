<template>
  <v-row>
    <v-col>
      <v-data-table :items="tickets" :headers="headers">
        <template v-slot:item.id="{item}">
          <nuxt-link :to="`/client/ticket/view/${item._id}`">
            {{ item.resume }}
          </nuxt-link>
        </template>
        <template v-slot:item.status.name="{ item }">
          {{ item.status.name }}
        </template>
        <template v-slot:item.group.name="{item}">
          {{ item.group.name }}
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: 'client',
  data() {
    return {
      headers: [
        {
          text: 'ID',
          value: 'id'
        },
        {
          text: 'Status',
          value: 'status.name'
        },
        {
          text: 'Grupo',
          value: 'group.name'
        }
      ]
    }
  },
  asyncData({ $axios }) {
    return $axios.get('/ticket').then(response => {
      return {
        tickets: response.data.docs
      }
    })
  }
}
</script>

<style>
</style>
