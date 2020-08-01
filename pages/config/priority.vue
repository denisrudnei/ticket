<template>
  <v-row>
    <v-col>
      <v-tabs>
        <v-tab to="/config/priority/create">
          {{ $t('create') }}
        </v-tab>
        <v-tab to="/config/priority/list">
          {{ $t('list') }}
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
