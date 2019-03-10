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
          v-model="analyst.name"
          placeholder="Nome"
          solo
        />
        <v-text-field
          v-model="analyst.email"
          placeholder="Email"
          solo
        />
        <v-select
          v-model="analyst.group"
          :items="groups.map(g => { return { text: g.name, value: g } })"
          placeholder="Grupo"
          solo
          label="Grupo"
        />
        <v-btn @click="save">
          Criar
        </v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      groups: [],
      analyst: {
        name: '',
        email: '',
        group: ''
      }
    }
  },
  created() {
    this.$axios.get('api/group').then(result => {
      this.groups = result.data
    })
  },
  methods: {
    save() {
      this.$axios.post('api/analyst', this.analyst).then(() => {
        alert('Criado')
      })
    }
  }
}
</script>

<style>
</style>
