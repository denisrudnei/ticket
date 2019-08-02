<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
    >
      <v-tabs
        color="primary"
        dark
        slider-color="white"
      >
        <v-tab to="/config/analyst">
          Analista
        </v-tab>
        <v-tab to="/config/category">
          Categorias
        </v-tab>
        <v-tab to="/config/group">
          Grupos
        </v-tab>
        <v-tab to="/config/status">
          Status
        </v-tab>
        <v-tab to="/config/knowledge/list">
          Base de conhecimento
        </v-tab>
        <v-tab to="/config/permissions">
          Permissões
        </v-tab>
      </v-tabs>
      <nuxt-child />
    </v-flex>
  </v-layout>
</template>

<script>
export default {}
</script>

<style>
</style>
