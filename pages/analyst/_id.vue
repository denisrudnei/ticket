<template>
  <v-row>
    <v-col>
      <v-card>
        <v-card-title>
          {{ analyst.name }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="10">
              Email para contato {{ analyst.contactEmail }}
              <hr>
              Status: {{ analyst.status }}
            </v-col>
            <v-col cols="2">
              <v-img :src="analyst.picture" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn class="primary white--text" @click="show('openedBy', analyst)">
            Chamados abertos
          </v-btn>
          <v-btn class="primary white--text" @click="show('actualUser', analyst)">
            Chamados sendo tratados
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import showModal from '@/mixins/showModal'
export default {
  mixins: [showModal],
  asyncData({ params, $axios }) {
    return $axios.get(`/analyst/${params.id}`).then(response => {
      return {
        analyst: response.data
      }
    })
  },
  methods: {}
}
</script>

<style>
</style>
