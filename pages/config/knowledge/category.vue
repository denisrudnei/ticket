<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-tabs color="primary" slider-color="white" dark>
        <v-tab to="/config/knowledge/category/">
          Listar categorias
        </v-tab>
        <v-tab to="/config/knowledge/category/create">
          Criar categoria
        </v-tab>
      </v-tabs>
    </v-flex>
    <v-flex xs12 pa-2>
      <nuxt-child />
    </v-flex>
  </v-layout>
</template>

<script>
export default {}
</script>

<style>
</style>
