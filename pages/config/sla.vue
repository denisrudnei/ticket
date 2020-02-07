<template>
  <v-row>
    <v-col>
      <v-tabs cols="12">
        <v-tab to="/config/sla/create">
          {{ $t('create') }}
        </v-tab>
    
        <v-tab to="/config/sla/list">
          Listagem
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
