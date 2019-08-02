<template>
  <v-dialog
    :value="dialog"
    scrollable
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
                />
              </v-flex>
            </v-layout>
          </v-dialog>
          <v-flex xs12 pa-4>
            <div ref="preview" v-html="knowledge.preview" />
          </v-flex>
          <v-flex xs12 pa-3>
            <hr>
            <v-btn class=" primary white--text" @click="download()">
              Baixar it
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-text>
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
blockquote {
  font-size: 1.4em;
  font-family: Open Sans;
  font-style: italic;
  color: #555555;
  padding: 1.2em 30px 1.2em 75px;
  border-left: 0.5px solid #78c0a8;
  line-height: 1.6;
  position: relative;
  background: #ededed;
}

blockquote::before {
  font-family: Arial;
  content: '\201C';
  color: #78c0a8;
  font-size: 4em;
  position: absolute;
  left: 10px;
  top: -10px;
}

blockquote::after {
  content: '';
}

blockquote span {
  display: block;
  color: #333333;
  font-style: normal;
  font-weight: bold;
  margin-top: 1em;
}
</style>
