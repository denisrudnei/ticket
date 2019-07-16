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
              v-model="knowledge.category.name"
              label="Categoria"
              box
              readonly
              append-icon="search"
              @click="openCategoryModal(knowledge.category._id)"
            />
          </v-flex>
          <v-flex xs6 pa-2>
            <v-text-field
              v-model="knowledge.group.name"
              label="Grupo responsável"
              box
              readonly
              append-icon="search"
              @click="openGroupModal(knowledge.group._id)"
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
            <span>{{ knowledge.preview }}</span>
          </v-flex>
          <v-flex xs12 pa-3>
            <hr>
            <a target="_blank" class="v-btn primary white--text" :href="`/api/knowledge/${knowledge._id}/file`">Baixar it</a>
          </v-flex>
        </v-layout>
      </v-card-text>
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
    openCategoryModal(value) {
      this.showModal = true
      this.$router.push({
        query: {
          category: value
        }
      })
    },
    openGroupModal(value) {
      this.showModal = true
      this.$router.push({
        query: {
          group: value
        }
      })
    },
    close() {
      this.dialog = false
      this.$router.back()
    }
  }
}
</script>

<style>
</style>
