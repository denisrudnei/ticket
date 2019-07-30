<template>
  <v-layout row wrap>
    <v-flex xs12 pa-2>
      <v-text-field
        v-model="knowledgeData.name"
        box
        label="Nome do documento"
      />
    </v-flex>
    <v-flex xs12 md6 pa-2>
      <v-select
        v-model="knowledge.category"
        box
        placeholder="Categoria do problema"
        :items="category.map(v => ({text: v.fullName, value: v}))"
      />
    </v-flex>
    <v-flex xs12 md6 pa-2>
      <v-select
        v-model="knowledge.group"
        box
        :items="group.map(v => ({text: v.name, value: v}))"
        placeholder="Grupo responsável"
      />
    </v-flex>
    <v-flex xs12 pa-2>
      <ckeditor v-model="knowledge.preview" :editor="editor" />
      <input ref="file" type="file" style="display: none">
      <v-btn class="primary white--text" @click="addFile()">
        <v-icon>attach_file</v-icon>
        Incluir arquivo
      </v-btn>
      <v-btn
        :disabled="disabled"
        class="primary white--text"
        @click="save()"
      >
        Salvar
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => ({
        name: '',
        preview: '',
        group: '',
        category: ''
      })
    }
  },
  data() {
    return {
      editor: null,
      items: [],
      category: [],
      group: [],
      knowledgeData: {
        name: '',
        preview: '',
        group: '',
        category: ''
      }
    }
  },
  computed: {
    knowledge() {
      return Object.assign(this.knowledgeData, this.value)
    },
    disabled() {
      return (
        this.knowledge.name === '' ||
        this.knowledge.preview === '' ||
        this.knowledge.category === '' ||
        this.knowledge.group === ''
      )
    }
  },
  async created() {
    this.editor = require('@ckeditor/ckeditor5-build-classic')
    const category = await this.$axios.get('/category/')
    const group = await this.$axios.get('/group/')

    this.category = category.data
    this.group = group.data
  },
  methods: {
    save() {
      this.$emit('change', this.knowledge)
    },
    addFile() {
      this.$refs.file.click()
    }
  }
}
</script>

<style>
</style>
