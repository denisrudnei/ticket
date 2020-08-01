<template>
  <v-row>
    <v-col>
      <v-tabs show-arrows>
        <v-tab to="/config/address/list">
          {{ $t('list') }}
        </v-tab>
        <v-tab to="/config/address/create">
          {{ $t('create') }}
        </v-tab>
      </v-tabs>
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
export default {};
</script>

<style></style>
