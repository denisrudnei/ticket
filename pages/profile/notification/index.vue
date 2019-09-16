<template>
  <v-row>
    <v-col
      cols="12"
    >
      <v-tabs show-arrows>
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
