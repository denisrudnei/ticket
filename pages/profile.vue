<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
      pa-2
    >
      <v-form>
        <v-text-field
          box
          label="Nome para exibição"
        />
        <v-text-field
          box
          label="Email"
          readonly
        />
        <v-switch
          v-model="user.receiveEmail"
          color="primary"
          label="Receber notificações via email?"
        />
        <v-btn
          flat
          class="primary white--text"
        >
          Salvar configurações
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
        name: '',
        email: '',
        receiveEmail: false
      }
    }
  }
}
</script>

<style>
</style>
