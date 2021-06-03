<template>
  <v-row>
    <v-col cols="12">
      <v-tabs show-arrows>
        <v-tab to="/search/ticket">
          Tickets
        </v-tab>
        <v-tab to="/search/manyTickets">
          {{ $t('many_tickets_per_number') }}
        </v-tab>
        <v-tab to="/search/analyst">
          {{ $t('analysts') }}
        </v-tab>
        <v-tab to="/search/category">
          {{ $t('categories') }}
        </v-tab>
        <v-tab to="/search/group">
          {{ $t('groups') }}
        </v-tab>
      </v-tabs>
    </v-col>
    <v-col cols="12">
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
export default {};
</script>

<style></style>
