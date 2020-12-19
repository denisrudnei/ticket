<template>
  <v-row>
    <v-col>
      <h1>Deslogando...</h1>
    </v-col>
  </v-row>
</template>

<script>
export default {
  auth: false,
  mounted() {
    this.$router.push('/auth/');
  },
};
</script>

<style>

</style>
