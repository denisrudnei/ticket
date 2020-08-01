<template>
  <v-row>
    <v-col cols="12">
      <v-tabs show-arrows>
        <v-tab to="/profile/path/view">
          Pré-visualizar
        </v-tab>
        <v-tab to="/profile/path/add">
          Adicionar
        </v-tab>
        <v-tab to="/profile/path/list">
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
