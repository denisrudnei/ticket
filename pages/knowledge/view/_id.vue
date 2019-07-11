<template>
  <v-dialog
    :value="dialog"
    width="90vw"
  >
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
    <v-card>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12 pa-3>
            <h3>Documento criado em: {{ knowledge.created | date }}</h3>
            <span>{{ knowledge.preview }}</span>
            <iframe :src="`/api/knowledge/${knowledge._id}/file`" style="width: 100%; height: 100vh" />
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
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
    close() {
      this.dialog = false
      this.$router.back()
    }
  }
}
</script>

<style>
</style>
