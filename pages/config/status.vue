<template>
  <v-row>
    <v-col cols="12">
      <v-tabs show-arrows>
        <v-tab to="/config/status">
          {{ $t('list') }}
        </v-tab>
        <v-tab to="/config/status/create">
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
