<template>
  <v-layout row wrap>
    <v-flex xs4 pa-2>
      <v-select
        v-model="selected"
        box
        :items="paths.map(v => ({text: v.path, value: v}))"
      />
    </v-flex>
    <v-flex xs4 pa-2>
      <v-select
        v-model="selected.group"
        :disabled="selected.options <= 0"
        box
        :items="selected.options.map(v => ({text: v, value: v}))"
      />
    </v-flex>
    <v-flex xs4 pa-2>
      <v-text-field
        v-model="selected.name"
        :disabled="selected.group === ''"
        box
        placeholder="Nome na listagem"
      />
    </v-flex>
    <v-btn class="primary white--text" :disabled="selected.name === ''" @click="save()">
      <v-icon left>
        save
      </v-icon>
      Salvar
    </v-btn>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      selected: {
        options: [],
        group: '',
        name: ''
      }
    }
  },
  asyncData({ $axios }) {
    return $axios.get('/info/path/refs').then(response => {
      return {
        paths: response.data
      }
    })
  },
  methods: {
    save() {
      this.$axios.post('/info/path', this.selected).then(() => {
        this.$toast.show('Cadastrado', {
          duration: 5000
        })
      })
    }
  }
}
</script>

<style>
</style>
