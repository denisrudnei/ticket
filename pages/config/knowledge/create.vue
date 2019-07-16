<template>
  <v-layout row wrap>
    <v-flex xs12 pa-2>
      <v-text-field
        v-model="knowledge.name"
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
      <v-textarea
        v-model="knowledge.preview"
        label="Resumo"
        box
      />
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
  data() {
    return {
      items: [],
      knowledge: {
        name: '',
        preview: '',
        group: '',
        category: ''
      }
    }
  },
  computed: {
    disabled() {
      return (
        this.knowledge.name === '' ||
        this.knowledge.preview === '' ||
        this.knowledge.category === '' ||
        this.knowledge.group === ''
      )
    }
  },
  asyncData: async ({ $axios }) => {
    const category = await $axios.get('/category/')
    const group = await $axios.get('/group/')
    return {
      category: category.data,
      group: group.data
    }
  },
  methods: {
    save() {
      this.$axios.post('/knowledge', this.knowledge).then(response => {
        this.$toast.show('Criado documento de conhecimento', {
          duration: 5000,
          icon: 'done'
        })
        if (this.$refs.file.files.length > 0) {
          const formData = new FormData()
          formData.append('file', this.$refs.file.files[0])
          this.$axios
            .post(`/knowledge/${response.data._id}/file`, formData)
            .then(() => {
              this.$toast.show('Documento enviado com sucesso', {
                duration: 5000,
                icon: 'done'
              })
            })
        }
      })
    },
    addFile() {
      this.$refs.file.click()
    }
  }
}
</script>

<style>
</style>
