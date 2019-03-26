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
          <td>{{ item.analysts.length }}</td>
          <td>
            <v-menu
              offset-y
              :close-on-content-click="false"
            >
              <template
                v-slot:activator="{ on }"
              >
                <v-btn
                  flat
                  class="primary white--text"
                  v-on="on"
                >
                  Adicionar usuário ao grupo
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
                      v-model="analyst"
                      :items="analysts.map(a => ({text: a.name, value: a}))"
                      box
                    />
                  </v-flex>
                  <v-flex
                    xs12
                    pa-2
                  >
                    <v-btn
                      icon
                      @click="addToGroup(item, analyst)"
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
          <td>
            <v-menu
              :close-on-content-click="false"
            >
              <template
                v-slot:activator="{ on }"
              >
                <v-btn
                  class="red white--text"
                  v-on="on"
                >
                  Remover alguém do grupo
                  <v-icon>
                    delete
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
                      v-model="analyst"
                      box
                      :items="analysts.map(a => ({text: a.name, value: a}))"
                    />
                  </v-flex>
                  <v-flex
                    xs12
                    pa-2
                  >
                    <v-btn
                      icon
                      @click="removeToGroup(item, analyst)"
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
      analyst: {},
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
    await this.$axios.get('api/group').then(response => {
      this.$store.commit('group/setGroups', response.data)
    })

    await this.$axios.get('api/analyst').then(response => {
      this.$store.commit('analyst/setAnalysts', response.data)
    })
  },
  methods: {
    addToGroup(group, analyst) {
      this.$axios
        .post(`api/group/analyst/${group._id}`, this.analyst)
        .then(response => {
          this.$toast.show('Adicionado', {
            duration: 1000
          })
        })
    },
    removeToGroup(group, analyst) {
      this.$axios
        .delete(`api/group/analyst/${group._id}/${analyst._id}`)
        .then(response => {
          this.$toast.show('Removido do grupo', {
            duration: 1000
          })
        })
    }
  }
}
</script>

<style>
</style>
