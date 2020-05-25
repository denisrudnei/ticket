<template>
  <client-only>
    <v-dialog
      :value="dialog"
      scrollable
      persistent
    >
      <v-card>
        <v-toolbar class="primary white--text">
          <v-toolbar-title>
            {{ knowledge.name }}
          </v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn icon class="primary white--text" @click="close()">
              <v-icon>
                close
              </v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="12" pa-3>
              <h3>Documento criado em: {{ knowledge.created | date }}</h3>
            </v-col>
            <v-col cols="6" pa-3>
              <v-text-field
                v-model="knowledge.category.fullName"
                label="Categoria"
                filled
                readonly
                append-icon="search"
                :value-comparator="compare"
                @click:append="openModal('category', knowledge.category)"
              />
            </v-col>
            <v-col cols="6" pa-3>
              <v-text-field
                v-model="knowledge.group.name"
                label="Grupo responsável"
                filled
                readonly
                append-icon="search"
                :value-comparator="compare"
                @click:append="openModal('group', knowledge.group)"
              />
            </v-col>
            <v-col cols="12" pa-4>
              <div id="preview" ref="preview" v-html="knowledge.preview" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <a ref="download" :href="knowledge.url" download style="display: none;" />
          <v-btn tile class="primary white--text" @click="download()">
            Baixar IT
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </client-only>
</template>

<script>
import ggl from 'graphql-tag'
import KnowledgeById from '@/graphql/query/knowledge/knowledgeById.graphql'
export default {
  data() {
    return {
      showModal: false,
      dialog: true
    }
  },
  head() {
    return {
      title: this.knowledge.name
    }
  },
  asyncData({ params, app }) {
    return app.$apollo
      .query({
        query: ggl(KnowledgeById),
        variables: {
          id: params.id
        }
      })
      .then(response => {
        return {
          knowledge: response.data.knowledge
        }
      })
  },
  mounted() {
    const id = this.$route.params.id
    this.$apollo
      .query({
        query: ggl(KnowledgeById),
        variables: {
          id: id
        }
      })
      .then(response => {
        this.knowledge = response.data.knowledge
      })
  },
  methods: {
    compare(obj1, obj2) {
      return obj1.id === obj2.id
    },
    openModal(field, value) {
      this.showModal = true
      if (Object.prototype.hasOwnProperty.call(value, 'id')) {
        this.$store.commit('ticket/setModalQuery', {
          [field]: value.id
        })
        this.$store.commit('ticket/setModalList', true)
      }
    },
    download() {
      this.$refs.download.click()
    },
    close() {
      this.dialog = false
      this.$router.back()
    }
  }
}
</script>

<style>
img {
  max-width: 100%;
}
</style>
