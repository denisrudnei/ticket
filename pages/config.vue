<template>
  <v-row>
    <v-col
      cols="12"
      pa-1
    >
      <v-tabs
        slider-color="primary"
        show-arrows
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
        <v-tab to="/config/address">
          Configurar endereços
        </v-tab>
        <v-tab to="/config/knowledge/list">
          Base de conhecimento
        </v-tab>
        <v-tab to="/config/permissions">
          Permissões
        </v-tab>
        <v-tab to="/config/playground">
          <v-icon left>
            format_shapes
          </v-icon>
          API
        </v-tab>
      </v-tabs>
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
export default {
  created() {
    if (this.$route.path === '/config') {
      this.$router.push('/config/analyst')
    }
  }
}
</script>

<style>
</style>
