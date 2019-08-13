<template>
  <v-layout>
    <v-flex xs12 pa-2>
      <v-text-field v-model="user.email" solo placeholder="Seu email cadastrado" />
      <v-btn class="primary white--text" @click="reset()">
        Enviar email para reset de senha
        <v-icon right>
          mail
        </v-icon>
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  auth: false,
  data() {
    return {
      user: {
        eamil: ''
      }
    }
  },
  methods: {
    reset() {
      this.$axios.post('/auth/redefine', this.user).then(() => {
        this.$toast.show('Solicitado reset, verifique sua caixa de e-mail', {
          duration: 10000,
          icon: 'done'
        })
      })
    }
  }
}
</script>

<style>
</style>
