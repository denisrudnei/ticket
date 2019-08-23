<template>
  <v-row>
    <v-col v-if="ticket.category" cols="12" pa-3>
      <v-text-field
        v-for="field in ticket.category.fields"
        :key="field._id"
        :disabled="!edit"
        :required="field.required"
        filled
        :label="field.text"
      />
    </v-col>
  </v-row>
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
