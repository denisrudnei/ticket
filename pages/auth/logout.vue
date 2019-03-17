<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
      pa-5
    >
      <v-btn
        class="primary white--text"
        large
        @click="logout()"
      >
        Deslogar?
      </v-btn>
      <v-btn
        class="primary white--text"
        large
        @click="back()"
      >
        Voltar
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$auth.logout().then(() => {
        this.$router.push('/')
      })
    },
    back() {
      this.$router.back()
    }
  }
}
</script>

<style>
</style>
