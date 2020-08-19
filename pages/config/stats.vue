<template>
  <v-row>
    <v-tabs>
      <v-tab to="/config/stats/">
        {{ $t('database_item_count') }}
      </v-tab>
    </v-tabs>
    <nuxt-child />
  </v-row>
</template>

<script>
export default {

};
</script>

<style>

</style>
