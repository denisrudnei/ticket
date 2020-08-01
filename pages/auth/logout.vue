<template>
  <v-row>
    <v-col cols="12" pa-3>
      <v-btn class="primary white--text" large @click="logout()">
        Deslogar?
      </v-btn>
      <v-btn class="primary white--text" large @click="back()">
        Voltar
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$auth.logout().then(() => {
        this.$router.push('/');
      });
    },
    back() {
      this.$router.back();
    },
  },
};
</script>

<style></style>
