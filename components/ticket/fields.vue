<template>
  <v-layout>
    <v-flex v-if="ticket.category" xs12 pa-2>
      <v-text-field
        v-for="field in ticket.category.fields"
        :key="field._id"
        :disabled="!edit"
        :required="field.required"
        box
        :label="field.text"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  computed: mapGetters({
    ticket: 'ticket/getActualTicket'
  })
}
</script>

<style>
</style>
