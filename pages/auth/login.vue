<template>
  <v-form>
    <v-text-field
      v-model="userLogin.email"
      placeholder="Login"
      solo
      @keypress.enter="localLogin()"
    />
    <v-text-field
      v-model="userLogin.password"
      placeholder="Senha"
      type="password"
      solo
      @keypress.enter="localLogin()"
    />
    <v-btn
      class="primary white--text"
      large
      :block="onMobile"
      @click="localLogin()"
    >
      Logar
    </v-btn>
  </v-form>
</template>

<script>
import afterLogin from '@/mixins/afterLogin'
export default {
  mixins: [afterLogin],
  data() {
    return {
      userLogin: {
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
          data: this.userLogin
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
    }
  }
}
</script>

<style>
</style>
