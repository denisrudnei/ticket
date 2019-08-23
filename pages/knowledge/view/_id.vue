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
          <v-dialog
            v-model="showModal"
            scrollable
          >
            <v-row>
              <v-col cols="12" pa-3>
                <ticket-list
                  v-if="showModal"
                  :url="`/search/`"
                  :modal="true"
                />
              </v-col>
            </v-row>
          </v-dialog>
          <v-col cols="12" pa-4>
            <div ref="preview" v-html="knowledge.preview" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn tile class="primary white--text" @click="download()">
          Baixar it
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import TicketList from '@/components/ticket/list'
export default {
  components: {
    TicketList
  },
  data() {
    return {
      showModal: false,
      dialog: true,
      JsPDF: null
    }
  },
  asyncData({ params, $axios }) {
    return $axios.get(`/knowledge/view/${params.id}`).then(response => {
      return {
        knowledge: response.data
      }
    })
  },
  mounted() {
    this.JsPDF = require('jspdf')
  },
  methods: {
    compare(obj1, obj2) {
      return obj1._id === obj2._id
    },
    openModal(field, value) {
      this.showModal = true
      if (Object.prototype.hasOwnProperty.call(value, '_id')) {
        this.$store.commit('ticket/setModalQuery', {
          [field]: value._id
        })
        this.$store.commit('ticket/setModalList', true)
      }
    },
    download() {
      const pdf = new this.JsPDF()
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
