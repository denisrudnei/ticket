<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
      pa-2
    >
      <v-tabs>
        <v-tab
          to="/profile"
        >
          Perfil
        </v-tab>
        <v-tab
          to="/profile/notification"
        >
          Notificações
        </v-tab>
        <v-tab
          to="/profile/password"
        >
          Senha
        </v-tab>
      </v-tabs>
      <nuxt-child />
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style>
</style>
