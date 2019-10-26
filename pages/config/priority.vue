<template>
  <v-row>
    <v-col>
      <v-tabs>
        <v-tab to="/config/priority/create">
          Criar
        </v-tab>
        <v-tab to="/config/priority/list">
          Listar
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
