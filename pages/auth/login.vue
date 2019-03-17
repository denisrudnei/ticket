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
        <!-- <v-text-field
          solo
          placeholder="Email"
        />
        <v-text-field
          solo
          type="password"
          placeholder="Senha"
        /> -->
        <v-btn
          large
          class="primary white--text"
          @click="login()"
        >
          Logar
          <v-icon
            right
          >
            person
          </v-icon>
        </v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  methods: {
    login() {
      this.$auth.login('auth0')
    }
  }
}
</script>

<style>
</style>
