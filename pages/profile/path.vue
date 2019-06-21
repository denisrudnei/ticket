<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-tabs>
        <v-tab to="/profile/path/view">
          Pré-visualizar
        </v-tab>
        <v-tab to="/profile/path/add">
          Adicionar
        </v-tab>
        <v-tab to="/profile/path/list">
          Listar
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
