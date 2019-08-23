<template>
  <v-row>
    <v-col>
      <v-tabs show-arrows>
        <v-tab to="/config/permissions">
          Listar
        </v-tab>
        <v-tab to="/config/permissions/analyst">
          Atribuir permissões
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
