<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
      pa-2
    >
      <v-form
        ref="form"
      >
        <v-text-field
          v-model="user.oldPassword"
          placeholder="Senha atual"
          type="password"
          box
          :rules="rules.old"
        />
        <v-text-field
          v-model="user.newPassword"
          placeholder="Nova senha"
          type="password"
          box
          :rules="rules.newPassword"
        />
        <v-text-field
          v-model="user.confirmPassword"
          placeholder="Repita a nova senha"
          type="password"
          box
          :rules="rules.confirm"
        />
        <v-btn
          class="primary white--text"
          @click="resetPassword()"
        >
          Salvar
          <v-icon
            right
          >
            lock
          </v-icon>
        </v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
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
        this.$axios.post('/auth/password/reset', this.user).then(
          () => {
            this.$toast.show('Resetado', {
              duration: 1000,
              icon: 'lock_open'
            })
          },
          error => {
            this.$toast.error(
              `Falha ao resetar: ${error.response.data.message}`,
              {
                duration: 5000,
                icon: 'error'
              }
            )
          }
        )
      }
    }
  }
}
</script>

<style>
</style>
