<template>
  <v-form>
    <v-text-field v-model="user.email" type="email" solo placeholder="Seu email cadastrado" />
    <v-btn class="primary white--text" @click="reset()">
      Enviar email para reset de senha
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
          this.showMessage()
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
