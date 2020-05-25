<template>
  <v-row>
    <v-col
      cols="12"
      pa-3
    >
      <v-data-table
        :items="analysts.filter(a => { return a.id !== user.id })"
        :headers="headers"
      >
        <template
          v-slot:item.name="{ item }"
        >
          {{ item.name }}
        </template>
        <template
          v-slot:item.role="{ item }"
        >
          {{ item.role }}
        </template>
        <template
          v-slot:item.actions="{ item }"
        >
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
              <v-card-text>
                <v-row>
                  <v-col
                    cols="12"
                    pa-3
                  >
                    <v-select
                      v-model="selected"
                      filled
                      :items="roles.map(r => { return { text: r.name, value: r }})"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    pa-3
                  >
                    <v-btn
                      class="primary white--text"
                      icon
                      @click="updateRole(item.id)"
                    >
                      <v-icon>
                        save
                      </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-menu>
        </template>
      </v-data-table> 
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      selected: ''
    }
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t('name'),
          value: 'name'
        },
        {
          text: this.$t('role'),
          value: 'role'
        },
        {
          text: this.$t('actions'),
          value: 'actions'
        }
      ]
    },
    ...mapGetters({
      roles: 'role/getRoles',
      user: 'auth/getUser'
    })
  },
  asyncData({ $axios }) {
    return $axios.get('/config/analyst').then(response => {
      return {
        analysts: response.data
      }
    })
  },
  mounted() {
    this.$store.dispatch('role/downloadRoles')
  },
  methods: {
    updateRole(analystId) {
      this.$axios.post(`/config/role/${analystId}`, this.selected).then(() => {
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
