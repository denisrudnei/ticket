<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
      md8
      pa-5
    >
      <nuxt-child />
    </v-flex>
    <v-flex xs12 md4 pa-5>
      <v-btn
        large
        block
        class="primary white--text"
        to="/auth/login"
      >
        Logar
        <v-icon
          right
        >
          person
        </v-icon>
      </v-btn>
      <v-btn
        large
        block
        class="primary white--text"
        @click="login()"
      >
        Login externo
        <v-icon right>
          import_export
        </v-icon>
      </v-btn>
      <v-btn
        large
        block
        class="primary white--text"
        to="/auth/reset"
      >
        Resetar senha
        <v-icon right>
          lock
        </v-icon>
      </v-btn>
      <v-btn
        large
        block
        class="primary white--text"
        to="/auth/register"
      >
        Registrar
        <v-icon right>
          create
        </v-icon>
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  methods: {
    login() {
      this.$auth.loginWith('auth0').catch(e => {
        this.$toast.error('Falha ao logar', {
          duration: 1000,
          icon: 'error'
        })
      })
    }
  }
}
</script>

<style>
</style>
