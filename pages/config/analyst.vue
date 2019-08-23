<template>
  <v-row>
    <v-col
      cols="12"
    >
      <v-tabs show-arrows>
        <v-tab to="/config/analyst">
          Listar
        </v-tab>
        <v-tab
          to="/config/analyst/create"
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
