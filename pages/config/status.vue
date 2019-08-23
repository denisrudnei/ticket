<template>
  <v-row>
    <v-col
      cols="12"
    >
      <v-tabs show-arrows>
        <v-tab to="/config/status">
          Listar
        </v-tab>
        <v-tab
          to="/config/status/create"
        >
          Criar
        </v-tab>
      </v-tabs>
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
export default {}
</script>

<style>
</style>
