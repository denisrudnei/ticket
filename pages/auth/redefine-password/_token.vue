<template>
  <v-form>
    <v-text-field v-model="password" solo :placeholder="$t('new_password')" type="password" />
    <v-btn class="primary white--text" @click="redefine()">
      {{ $t('save_new_password') }}
      <v-icon right>
        lock_open
      </v-icon>
    </v-btn>
  </v-form>
</template>

<script>
import resetPasswordWithToken from '@/graphql/mutation/auth/resetPasswordWithToken.graphql'
import ggl from 'graphql-tag'
export default {
  auth: false,
  data() {
    return {
      password: ''
    }
  },
  methods: {
    redefine() {
      const token = this.$route.params.token
      this.$apollo
        .mutate({
          mutation: ggl(resetPasswordWithToken),
          variables: {
            token,
            newPassword: this.password
          }
        })
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
