<template>
  <v-data-table :items="slas" :headers="headers">
    <template v-slot:item.name="{item}">
      {{ item.name }}
    </template>
    <template v-slot:item.limit="{item}">
      {{ item.limit | toSla }}
    </template>
  </v-data-table>
</template>

<script>
import ggl from 'graphql-tag'
import slaList from '@/graphql/query/config/sla/slaList.graphql'
import { format } from 'date-fns'
export default {
  filters: {
    toSla(value) {
      const result = new Date(value)
      return format(result, 'HH:mm')
    }
  },
  data() {
    return {
      slas: []
    }
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t('name'),
          value: 'name'
        },
        {
          text: 'limit',
          value: 'limit'
        }
      ]
    }
  },
  mounted() {
    this.$apollo
      .query({
        query: ggl(slaList)
      })
      .then(response => {
        this.slas = response.data.slas
      })
  }
}
</script>

<style>
</style>
