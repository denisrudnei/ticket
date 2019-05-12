<template>
  <v-layout
    row
    wrap
  >
    <v-flex>
      <v-tabs>
        <v-tab to="/config/permissions">
          Listar
        </v-tab>
        <v-tab to="/config/permissions/analyst">
          Atribuir permissões
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
