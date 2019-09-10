<template>
  <v-row>
    <v-col>
      <v-tabs show-arrows>
        <v-tab to="/search/ticket/">
          Tickets
        </v-tab>
        <v-tab to="/search/analyst">
          Analistas
        </v-tab>
        <v-tab to="/search/category">
          Categorias
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
