<template>
  <v-row>
    <v-col
      cols="12"
      pa-3
    >
      <v-form
        ref="form"
      >
        <v-text-field
          v-model="user.oldPassword"
          placeholder="Senha atual"
          type="password"
          filled
          :rules="rules.old"
        />
        <v-text-field
          v-model="user.newPassword"
          placeholder="Nova senha"
          type="password"
          filled
          :rules="rules.newPassword"
        />
        <v-text-field
          v-model="user.confirmPassword"
          placeholder="Repita a nova senha"
          type="password"
          filled
          :rules="rules.confirm"
        />
        <v-btn
          class="primary white--text"
          @click="resetPassword()"
        >
          {{ $t('save') }}
          <v-icon
            right
          >
            lock
          </v-icon>
        </v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import resetPassword from '@/graphql/mutation/profile/resetPassword.graphql'
import ggl from 'graphql-tag'
export default {
  data() {
    return {
      user: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        old: [v => !!v || 'Preencha sua senha antiga'],
        newPassword: [
          v => !!v || 'Preencha a nova senha',
          v => v === this.user.confirmPassword || 'As senhas devem ser iguais'
        ],
        confirm: [
          v => !!v || 'Deve haver uma senha',
          v => v === this.user.newPassword || 'As senhas devem ser iguais'
        ]
      }
    }
  },
  methods: {
    resetPassword() {
      if (this.$refs.form.validate()) {
        this.$apollo
          .mutate({
            mutation: ggl(resetPassword),
            variables: {
              oldPassword: this.user.oldPassword,
              newPassword: this.user.newPassword
            }
          })
          .then(() => {
            this.$toast.show('Resetado', {
              duration: 1000,
              icon: 'lock_open'
            })
          })
          .catch(() => {
            this.$toast.error('Falha ao resetar', {
              duration: 5000,
              icon: 'error'
            })
          })
      }
    }
  }
}
</script>

<style>
</style>
