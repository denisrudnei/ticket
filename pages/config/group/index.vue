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
                      class="primary white--text"
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
      headers: [
        {
          text: 'Nome',
          value: 'name'
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
  }
}
</script>

<style>
</style>
