<template>
  <v-form>
    <v-text-field
      v-model="userLogin.email"
      :placeholder="$t('login')"
      solo
      @keypress.enter="localLogin()"
    />
    <v-text-field
      v-model="userLogin.password"
      :placeholder="$t('password')"
      type="password"
      solo
      @keypress.enter="localLogin()"
    />
    <v-btn
      class="primary white--text"
      large
      tile
      :block="onMobile"
      @click="localLogin()"
    >
      {{ $t('login') }}
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
