<template>
  <v-row>
    <v-col cols="12" pa-3>
      <v-text-field
        v-model="knowledgeData.name"
        filled
        label="Nome do documento"
      />
    </v-col>
    <v-col cols="12" md="6" pa-3>
      <v-select
        v-model="knowledge.category"
        filled
        :value-comparator="compare"
        placeholder="Categoria do problema"
        :items="category.map(v => ({text: v.fullName, value: v}))"
      />
    </v-col>
    <v-col cols="12" md="6" pa-3>
      <v-select
        v-model="knowledge.group"
        filled
        :value-comparator="compare"
        :items="group.map(v => ({text: v.name, value: v}))"
        placeholder="Grupo responsável"
      />
    </v-col>
    <v-col cols="12" pa-3>
      <client-only>
        <ckeditor v-model="knowledge.preview" :editor="editor" @ready="configureEditor" />
      </client-only>
      <input ref="file" type="file" style="display: none">
      <v-btn class="primary white--text" @click="addFile()">
        <v-icon>attach_file</v-icon>
        {{ $t('add_file') }}
      </v-btn>
      <v-btn
        tile
        :disabled="disabled"
        class="primary white--text"
        @click="save()"
      >
        {{ $t('save') }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import compareObjectsWithId from '@/mixins/compareObjectsWithId'
import ImageUploadAdapter from '@/plugins/image-upload-adapter'
export default {
  mixins: [compareObjectsWithId],
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
  mounted() {
    this.editor = require('@ckeditor/ckeditor5-build-classic')
  },
  async created() {
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
    },
    configureEditor(editor) {
      editor.plugins.get('FileRepository').createUploadAdapter = loader => {
        return new ImageUploadAdapter(loader, this.$axios)
      }
    }
  }
}
</script>

<style>
</style>
