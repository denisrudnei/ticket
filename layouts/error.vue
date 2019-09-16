<template>
  <v-row>
    <v-col cols="12">
      Error {{ error.statusCode }}
    </v-col>
    <v-col cols="12">
      Path {{ error.path }}
    </v-col>
  </v-row>
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
