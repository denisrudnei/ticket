<template>
  <v-list
    two-line
  >
    <v-menu
      v-for="analyst in analysts"
      :key="analyst._id"
      :open-on-hover="true"
    >
      <template
        v-slot:activator="{ on }"
      >
        <v-list-tile>
          <v-list-tile-avatar
            v-on="on"
          >
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
      </template>
      <v-card>
        <v-layout
          row
          wrap
        >
          <v-flex
            xs4
            pa-2
          >
            <v-img
              :src="analyst.picture"
              :alt="analyst.name"
            />
          </v-flex>
          <v-flex
            xs8
            pa-2
          >
            <v-layout
              row
              wrap
            >
              <v-flex
                xs12
                pa-2
              >
                {{ analyst.name }}
              </v-flex>
              <v-flex
                xs12
                pa-2
              >
                Ultima vez ativo {{ new Date().toLocaleString() }}
              </v-flex>
              <v-flex
                xs-12
                pa-1
              >
                <v-btn
                  title="Chamados abertos"
                  icon
                  class="white primary--text"
                  @click="viewRecents(analyst.name)"
                >
                  <v-icon>
                    work
                  </v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card>
    </v-menu>
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
    },
    viewRecents(name) {
      this.$router.push({
        path: 'search',
        query: {
          'openedBy.name': name
        }
      })
    }
  }
}
</script>

<style>
</style>
