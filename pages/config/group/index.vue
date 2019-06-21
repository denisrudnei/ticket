<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
      pa-2
    >
      <v-data-table
        :items="groups"
        :headers="headers"
      >
        <template
          v-slot:items="{ item }"
        >
          <td>{{ item.name }}</td>
          <td>
            <v-menu
              :close-on-content-click="false"
              :close-on-click="true"
              :nudge-width="250"
              max-height="40vh"
            >
              <template
                v-slot:activator="{ on }"
              >
                <v-btn
                  class="primary white--text"
                  v-on="on"
                >
                  Listar usuários [{{ item.analysts.length }}]
                </v-btn>
              </template>
              <v-list
                v-if="item.analysts.length > 0"
                two-line
              >
                <v-list-tile
                  v-for="analyst in item.analysts"
                  :key="analyst._id"
                >
                  <v-list-tile-avatar>
                    <v-avatar>
                      <img :src="analyst.picture" alt="">
                    </v-avatar>
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
                      class="red white--text"
                      @click="removeFromGroup(item, analyst)"
                    >
                      <v-icon>
                        delete
                      </v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-menu>  
          </td>
          <td>
            <v-menu
              offset-y
              :close-on-content-click="false"
            >
              <template
                v-slot:activator="{ on }"
              >
                <v-btn
                  class="primary white--text"
                  title="Adicionar usuário ao grupo"
                  v-on="on"
                >
                  <v-icon>
                    note_add
                  </v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-layout
                  row
                  wrap
                >
                  <v-flex
                    xs12
                    pa-2
                  >
                    <v-autocomplete
                      v-model="currentAnalyst"
                      :items="analystsToAdd(item).map(a => ({text: a.name, value: a}))"
                      box
                    />
                  </v-flex>
                  <v-flex
                    xs12
                    pa-2
                  >
                    <v-btn
                      icon
                      @click="addToGroup(item, currentAnalyst)"
                    >
                      <v-icon>
                        send
                      </v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-menu>
          </td>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      currentAnalyst: undefined,
      headers: [
        {
          text: 'Nome',
          value: 'name'
        },
        {
          text: 'Quantidade de integrantes',
          value: 'length'
        },
        {
          text: 'Ações',
          value: 'actions'
        }
      ]
    }
  },
  computed: mapGetters({
    groups: 'group/getGroups',
    analysts: 'analyst/getAnalysts'
  }),
  async mounted() {
    await this.$axios.get('/group').then(response => {
      this.$store.commit('group/setGroups', response.data)
    })

    await this.$axios.get('/analyst').then(response => {
      this.$store.commit('analyst/setAnalysts', response.data)
    })
  },
  methods: {
    addToGroup(group, analyst) {
      this.$axios
        .post(`/config/group/analyst/${group._id}`, this.currentAnalyst)
        .then(response => {
          this.updateGroups()
          this.$toast.show('Adicionado', {
            duration: 1000
          })
        })
    },
    removeFromGroup(group, analyst) {
      this.$axios
        .delete(`/config/group/analyst/${group._id}/${analyst._id}`)
        .then(response => {
          this.updateGroups()
          this.$toast.show('Removido do grupo', {
            duration: 1000
          })
        })
    },
    updateGroups() {
      this.$axios.get('/group').then(response => {
        this.$store.commit('group/setGroups', response.data)
      })
    },
    analystsToAdd(group) {
      return this.analysts.filter(a => {
        return !group.analysts.map(ga => ga._id).includes(a._id)
      })
    }
  }
}
</script>

<style>
</style>
