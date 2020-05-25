<template>
  <v-row>
    <v-col v-if="ticket.category" cols="12" pa-3>
      <v-text-field
        v-for="field in ticket.category.fields"
        :key="field.id"
        :disabled="!edit"
        :required="field.required"
        filled
        :label="field.text"
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    edit: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      ticketData: {}
    }
  },
  computed: {
    ticket() {
      return Object.assign(this.ticketData, this.value)
    }
  }
}
</script>

<style>
</style>
