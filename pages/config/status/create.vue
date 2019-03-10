<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs112
    >
      <v-form>
        <v-text-field
          v-model="status.name"
          placeholder="Nome"
          solo
        />
        <v-btn @click="save()">
          Salvar
        </v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      status: {
        name: ''
      }
    }
  },
  methods: {
    save() {
      this.$axios.post('api/status', this.status).then(() => {
        alert('Criado')
      })
    }
  }
}
</script>

<style>
</style>
