<template>
  <v-row>
    <v-col
      cols="12"
      pa-3
    >
      <v-data-table
        :items="groups"
        :headers="headers"
      >
        <template
          v-slot:item.name="{ item }"
        >
          {{ item.name }}
        </template>
        <template
          v-slot:item.length="{ item }"
        >
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
                tile
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
              <v-list-item
                v-for="analyst in item.analysts"
                :key="analyst._id"
              >
                <v-list-item-avatar>
                  <v-avatar>
                    <img :src="analyst.picture" alt="">
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ analyst.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ analyst.email }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn
                    icon
                    class="red white--text"
                    @click="removeFromGroup(item, analyst)"
                  >
                    <v-icon>
                      delete
                    </v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-menu>  
        </template>
        <template
          v-slot:item.actions="{ item }"
        >
          <v-menu
            offset-y
            :close-on-content-click="false"
          >
            <template
              v-slot:activator="{ on }"
            >
              <v-btn
                icon
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
              <v-card-text>
                <v-row>
                  <v-col
                    cols="12"
                    pa-3
                  >
                    <v-autocomplete
                      v-model="currentAnalyst"
                      :items="analystsToAdd(item).map(a => ({text: a.name, value: a}))"
                      filled
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    pa-3
                  >
                    <v-btn
                      icon
                      @click="addToGroup(item, currentAnalyst)"
                    >
                      <v-icon>
                        send
                      </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-menu>
        </template>
        <template
          v-slot:item.edit="{ item }"
        >
          <v-btn class="primary white--text" icon :to="`/config/group/edit/${item._id}`">
            <v-icon>
              edit
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import list from '@/graphql/query/config/group/list.graphql'
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
        },
        {
          text: 'Editar',
          value: 'edit'
        }
      ]
    }
  },
  computed: mapGetters({
    groups: 'group/getGroups',
    analysts: 'analyst/getAnalysts'
  }),
  fetch({ $apollo, store }) {
    $apollo
      .query({
        query: list
      })
      .then(response => {
        store.commit('group/setGroups', response.data.Group)
        store.commit('analyst/setAnalysts', response.data.Analyst)
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
