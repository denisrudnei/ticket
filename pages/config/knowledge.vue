<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-tabs color="primary" slider-color="white" dark>
        <v-tab to="/config/knowledge/create">
          Criar documento
        </v-tab>
        <v-tab to="/config/knowledge/">
          Listar documentos
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
