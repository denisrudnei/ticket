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
          label="Email"
        />
        <v-text-field
          box
          label="Senha"
          type="password"
        />
        <v-btn
          flat
          class="primary white--text"
        >
          Registrar
        </v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
export default {}
</script>

<style>
</style>
