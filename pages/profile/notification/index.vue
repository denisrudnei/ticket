<template>
  <v-layout row wrap>
    <v-flex
      xs12
    >
      <v-tabs>
        <v-tab
          to="/profile/notification/all"
        >
          Todas notificações
        </v-tab>
        <v-tab
          to="/profile/notification/read"
        >
          Lidas
        </v-tab>
        <v-tab
          to="/profile/notification/unread"
        >
          Não lidas
        </v-tab>
      </v-tabs>
    </v-flex>
    <v-flex>
      <nuxt-child />
    </v-flex>
  </v-layout>
</template>

<script>
export default {}
</script>

<style>
</style>
