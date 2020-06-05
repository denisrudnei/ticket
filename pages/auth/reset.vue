<template>
  <v-form>
    <v-text-field v-model="user.email" type="email" solo :placeholder="$t('you_registered_email')" />
    <v-btn class="primary white--text" tile @click="reset()">
      {{ $t('send_email') }}
      <v-icon right>
        mail
      </v-icon>
    </v-btn>
  </v-form>
</template>

<script>
export default {
  auth: false,
  data() {
    return {
      user: {
        email: ''
      }
    }
  },
  methods: {
    reset() {
      this.$axios
        .post('/auth/redefine', this.user)
        .then(() => {
          this.showMessage()
        })
        .catch(() => {
          this.$toast.error('Falha ao mandar email de reset', {
            duration: 10000,
            icon: 'error'
          })
        })
    },
    showMessage() {
      this.$toast.show('Solicitado reset, verifique sua caixa de e-mail', {
        duration: 10000,
        icon: 'done'
      })
    }
  }
}
</script>

<style>
</style>
