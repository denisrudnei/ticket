<template>
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
        <v-layout row wrap>
          <v-flex xs12 pa-2>
            <h3>Documento criado em: {{ knowledge.created | date }}</h3>
          </v-flex>
          <v-flex xs6 pa-2>
            <v-text-field
              v-model="knowledge.category.fullName"
              label="Categoria"
              box
              readonly
              append-icon="search"
              :value-comparator="compare"
              @click:append="openModal('category', knowledge.category._id)"
            />
          </v-flex>
          <v-flex xs6 pa-2>
            <v-text-field
              v-model="knowledge.group.name"
              label="Grupo responsável"
              box
              readonly
              append-icon="search"
              :value-comparator="compare"
              @click:append="openModal('group', knowledge.group._id)"
            />
          </v-flex>
          <v-dialog
            v-model="showModal"
            scrollable
          >
            <v-layout row wrap>
              <v-flex xs12 pa-2>
                <ticket-list
                  v-if="showModal"
                  :url="`/search/`"
                  :modal="true"
                />
              </v-flex>
            </v-layout>
          </v-dialog>
          <v-flex xs12 pa-4>
            <div ref="preview" v-html="knowledge.preview" />
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn class="primary white--text" @click="download()">
          Baixar it
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import JsPDF from 'jspdf'
import TicketList from '@/components/ticket/list'
export default {
  components: {
    TicketList
  },
  data() {
    return {
      showModal: false,
      dialog: true
    }
  },
  asyncData({ params, $axios }) {
    return $axios.get(`/knowledge/view/${params.id}`).then(response => {
      return {
        knowledge: response.data
      }
    })
  },
  methods: {
    compare(obj1, obj2) {
      return obj1._id === obj2._id
    },
    openModal(field, value) {
      this.showModal = true
      this.$router.push({
        query: {
          [field]: value
        }
      })
    },
    download() {
      const pdf = new JsPDF()
      pdf.fromHTML(this.$refs.preview, 10, 10, {
        width: '190'
      })
      pdf.save(`${this.knowledge.name}.pdf`)
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
