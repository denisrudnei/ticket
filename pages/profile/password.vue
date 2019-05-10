<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
      pa-2
    >
      <v-text-field
        v-model="oldPassword"
        placeholder="Senha atual"
        type="password"
        box
      />
    </v-flex>
    <v-flex
      xs12
      pa-2
    >
      <v-text-field
        v-model="newPassword"
        placeholder="Nova senha"
        type="password"
        box
      />
    </v-flex>
    <v-flex
      xs12
      pa-2
    >
      <v-text-field
        v-model="confirmPassword"
        placeholder="Repita a nova senha"
        type="password"
        box
      />
    </v-flex>
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
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  },
  methods: {
    resetPassword() {
      this.$axios.post('/auth/reset').then(
        () => {
          this.$toast.show('Resetado', {
            duration: 1000,
            icon: 'unlock'
          })
        },
        () => {
          this.$toast.error('Falha ao resetar', {
            duration: 5000,
            icon: 'error'
          })
        }
      )
    }
  }
}
</script>

<style>
</style>
