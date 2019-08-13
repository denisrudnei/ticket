<template>
  <v-form>
    <v-text-field v-model="user.password" solo placeholder="Nova senha" type="password" />
    <v-btn class="primary white--text" @click="redefine()">
      Salvar nova senha
      <v-icon right>
        lock_open
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
        password: ''
      }
    }
  },
  methods: {
    redefine() {
      const token = this.$route.params.token
      this.$axios
        .post(`/auth/redefine-password/${token}`, this.user)
        .then(() => {
          this.$toast.show('Alterada', {
            duration: 1000,
            icon: 'done'
          })
          this.$router.push('/auth/login')
        })
        .catch(() => {
          this.$toast.error('Falha ao definir senha ao validar o token', {
            duration: 5000,
            icon: 'error'
          })
        })
    }
  }
}
</script>

<style>
</style>
