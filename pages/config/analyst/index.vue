<template>
  <v-row>
    <v-col
      cols="12"
      pa-3
    >
      <v-data-table
        :items="analysts"
        :headers="headers"
      />
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
        },
        {
          text: this.$t('contact_email'),
          value: 'contactEmail'
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
