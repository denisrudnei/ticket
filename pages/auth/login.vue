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
      <v-form>
        <v-text-field
          v-model="user.email"
          placeholder="Login"
          solo
          @keypress.enter="localLogin()"
        />
        <v-text-field
          v-model="user.password"
          placeholder="Senha"
          type="password"
          solo
          @keypress.enter="localLogin()"
        />
      </v-form>
    </v-flex>
    <v-flex xs12 md4 pa-5>
      <v-btn
        large
        block
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
import afterLogin from '@/mixins/afterLogin'
export default {
  mixins: [afterLogin],
  data() {
    return {
      user: {
        email: '',
        password: ''
      }
    }
  },
  computed: {
    onMobile() {
      return this.$vuetify.breakpoint.xsOnly
    }
  },
  methods: {
    localLogin() {
      this.$auth
        .loginWith('local', {
          data: this.user
        })
        .then(async () => {
          await this.processInfo()
          this.$router.push('/')
        })
        .catch(() => {
          this.$toast.error('Falha ao logar', {
            duration: 1000,
            icon: 'error'
          })
        })
    },
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
