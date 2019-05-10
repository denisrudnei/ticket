<template>
  <v-list
    two-line
  >
    <v-list-tile
      v-for="analyst in analysts"
      :key="analyst._id"
    >
      <v-list-tile-avatar>
        <v-img
          :src="analyst.picture"
        />
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>
          {{ analyst.name }}
        </v-list-tile-title>
        <v-list-tile-sub-title>
          {{ analyst.email }}
        </v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-btn
          icon
          class="green white--text"
          @click="openChat(analyst)"
        >
          <v-icon>
            chat
          </v-icon>
        </v-btn>
      </v-list-tile-action>
    </v-list-tile>
  </v-list>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: mapGetters({
    analysts: 'analyst/getAnalysts'
  }),
  async created() {
    await this.$axios.get('/analyst').then(reponse => {
      this.$store.commit('analyst/setAnalysts', reponse.data)
    })
  },
  methods: {
    openChat(analyst) {
      this.$store.commit('chat/setVisible', true)
      this.$store.commit('chat/setActive', analyst._id)
      this.$store.dispatch('chat/getMessages', analyst)
    }
  }
}
</script>

<style>
</style>
