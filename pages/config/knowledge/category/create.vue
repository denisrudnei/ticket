<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-text-field v-model="category.name" box label="Nome" />
    </v-flex>
    <v-btn class="primary white--text" @click="save()">
      Salvar
    </v-btn>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      category: {
        name: ''
      }
    }
  },
  methods: {
    save() {
      this.$axios.post('/knowledge/category', this.category).then(() => {
        this.$toast.show('Categoria criada', {
          duration: 5000,
          icon: 'done'
        })
      })
    }
  }
}
</script>

<style>
</style>
