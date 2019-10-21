<template>
  <v-row>
    <v-col cols="12">
      <h3>Categoria selecionada: {{ category.fullName }}</h3>
    </v-col>
    <v-col cols="12">
      <v-text-field filled placeholder="Descrição do chamado" />
    </v-col>
    <v-col cols="12">
      <v-textarea placeholder="Conteúdo" filled />
    </v-col>
    <v-col cols="12">
      <v-btn>
        Enviar
        <v-icon>
          save
        </v-icon>
      </v-btn>
    </v-col>
    <v-tabs show-arrows>
      <v-tab>
        Campos
      </v-tab>
      <v-tab-item>
        <v-col v-for="field in category.fields" :key="field._id" cols="12">
          <v-text-field :placeholder="field.text" filled />
        </v-col>
      </v-tab-item>
      <v-tab>
        Incluir arquivo
      </v-tab>
      <v-tab-item>
        <file />
      </v-tab-item>
    </v-tabs>
  </v-row>
</template>

<script>
import file from './file'
export default {
  layout: 'client',
  components: {
    file
  },
  asyncData({ $axios, params }) {
    return $axios.get(`/category/${params.name}`).then(response => {
      return {
        category: response.data
      }
    })
  },
  methods: {
    addFile() {}
  }
}
</script>

<style>
</style>
