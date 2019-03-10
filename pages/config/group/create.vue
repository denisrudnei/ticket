<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
    >
      <v-form>
        <v-text-field
          v-model="group.name"
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
      group: {
        name: ''
      }
    }
  },
  methods: {
    save() {
      this.$axios.post('api/group', this.group).then(() => {
        alert('Criado')
      })
    }
  }
}
</script>

<style>
</style>
