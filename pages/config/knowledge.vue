<template>
  <v-row>
    <v-col cols="12">
      <v-tabs show-arrows color="primary" slider-color="white">
        <v-tab to="/config/knowledge/create">
          Criar documento
        </v-tab>
        <v-tab to="/config/knowledge/list">
          Listar documentos
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
