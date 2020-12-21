<template>
  <v-row>
    <v-col>
      <v-tabs>
        <v-tab to="/config/stats/">
          {{ $t('database_item_count') }}
        </v-tab>
      </v-tabs>
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
export default {

};
</script>

<style>

</style>
