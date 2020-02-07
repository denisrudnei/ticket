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
          {{ $t('analysts') }}
        </v-tab>
        <v-tab to="/config/priority">
          {{ $t('priority') }}
        </v-tab>
        <v-tab to="/config/category">
          {{ $t('categories') }}
        </v-tab>
        <v-tab to="/config/sla">
          {{ $t('sla') }}
        </v-tab>
        <v-tab to="/config/group">
          {{ $t('groups') }}
        </v-tab>
        <v-tab to="/config/status">
          {{ $t('status') }}
        </v-tab>
        <v-tab to="/config/address">
          {{ $t('config_addresses') }}
        </v-tab>
        <v-tab to="/config/knowledge/list">
          {{ $t('knowledge_base') }}
        </v-tab>
        <v-tab to="/config/permissions">
          {{ $t('permissions') }}
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
