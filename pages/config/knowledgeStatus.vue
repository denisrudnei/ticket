<template>
  <v-row>
    <v-col cols="12">
      <v-tabs
        show-arrows
        color="primary"
        slider-color="white"
      >
        <v-tab to="/config/knowledgeStatus/create">
          {{ $t('create') }}
        </v-tab>
        <v-tab to="/config/knowledgeStatus/list">
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
