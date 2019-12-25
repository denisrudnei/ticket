<template>
  <v-row>
    <v-col
      cols="12"
    >
      <v-tabs show-arrows>
        <v-tab
          to="/profile/notification/all"
        >
          {{ $t('all_notifications') }}
        </v-tab>
        <v-tab
          to="/profile/notification/read"
        >
          {{ $t('read') }}
        </v-tab>
        <v-tab
          to="/profile/notification/unread"
        >
          {{ $t('unread') }}
        </v-tab>
      </v-tabs>
    </v-col>
    <v-col>
      <nuxt-child />
    </v-col>
  </v-row>
</template>

<script>
export default {}
</script>

<style>
</style>
