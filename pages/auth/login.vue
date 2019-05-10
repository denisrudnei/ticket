<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
      pa-5
    >
      <v-form>
        <v-text-field
          v-model="user.email"
          placeholder="Login"
          solo
        />
        <v-text-field
          v-model="user.password"
          placeholder="Senha"
          type="password"
          solo
        />
        <v-btn
          large
          class="primary white--text"
          @click="localLogin()"
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
          class="primary white--text"
          @click="login()"
        >
          Login externo
        </v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      user: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    localLogin() {
      this.$auth
        .loginWith('local', {
          data: this.user
        })
        .then(
          () => {},
          () => {
            this.$toast.error('Falha ao logar')
          }
        )
    },
    login() {
      this.$auth.login('auth0')
    }
  }
}
</script>

<style>
</style>
