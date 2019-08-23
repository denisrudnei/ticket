<template>
  <v-row>
    <v-col cols="4" pa-3>
      <v-select
        v-model="selected"
        filled
        :items="paths.map(v => ({text: v.path, value: v}))"
      />
    </v-col>
    <v-col cols="4" pa-3>
      <v-select
        v-model="selected.group"
        :disabled="selected.options <= 0"
        filled
        :items="selected.options.map(v => ({text: v, value: v}))"
      />
    </v-col>
    <v-col cols="4" pa-3>
      <v-text-field
        v-model="selected.name"
        :disabled="selected.group === ''"
        filled
        placeholder="Nome na listagem"
      />
    </v-col>
    <v-btn class="primary white--text" :disabled="selected.name === ''" @click="save()">
      <v-icon left>
        save
      </v-icon>
      Salvar
    </v-btn>
  </v-row>
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
