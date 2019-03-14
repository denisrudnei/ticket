<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
      pa-5
    >
      <v-form>
        <v-text-field
          solo
          placeholder="Email"
        />
        <v-text-field
          solo
          type="password"
          placeholder="Senha"
        />
        <v-btn
          class="primary white--text"
        >
          Logar
          <v-icon right>
            person
          </v-icon>
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
