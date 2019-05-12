<template>
  <v-layout
    row
    wrap
  >
    <template
      v-if="error.statusCode === 403"
    >
      Acesso negado ao recurso {{ error.path }}
    </template>
    <template
      v-if="error.statusCOe === 404"
    >
      Não foi possível localizar {{ error.path }}
    </template>
  </v-layout>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: null
    }
  }
}
</script>

<style>
</style>
