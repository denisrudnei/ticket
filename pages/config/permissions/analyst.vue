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
        :items="analysts"
        :headers="headers"
      >
        <template
          slot="items"
          slot-scope="data"
        >
          <td>{{ data.item.name }}</td>
          <td>{{ data.item.role }}</td>
          <td>
            <v-menu
              :close-on-content-click="false"
            >
              <template
                v-slot:activator="{ on }"
              >
                <v-btn
                  class="primary white--text"
                  icon
                  v-on="on"
                >
                  <v-icon>
                    edit
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
                    <v-select
                      box
                      v-model="selected"
                      :items="roles.map(r => { return { text: r.name, value: r }})"
                    />
                  </v-flex>
                  <v-flex
                    xs12
                    pa-2
                  >
                    <v-btn
                      @click="updateRole(data.item._id)"
                      class="primary white--text"
                      icon
                    >
                      <v-icon>
                        save
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
  computed: mapGetters({
    analysts: 'analyst/getAnalysts',
    roles: 'role/getRoles'
  }),
  mounted() {
    this.$store.dispatch('role/downloadRoles')
  },
  data() {
    return {
      selected: '',
      headers: [
        {
          text: 'Nome',
          value: 'name'
        },
        {
          text: 'Role',
          value: 'role'
        },
        {
          text: 'Ações',
          value: 'actions'
        }
      ]
    }
  },
  methods: {
    updateRole(analystId) {
      this.$axios.post(`/role/${analystId}`, this.selected).then(() => {
        this.$toast.show('Alterado', {
          duration: 1000,
          icon: 'verified_user'
        })
      })
    }
  }
}
</script>

<style>
</style>
