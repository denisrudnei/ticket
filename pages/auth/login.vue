<template>
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
    }
  }
}
</script>

<style>
</style>
