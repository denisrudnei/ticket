<template>
  <v-dialog :value="logout" max-width="50vw" persistent>
    <v-card>
      <v-card-title class="headline">
        {{ $t('do_you_want_logout') }}
      </v-card-title>
      <v-card-actions>
        <v-row>
          <v-col>
            <v-btn tile block class="primary white--text" @click="logoutUser()">
              <v-icon left>
                done
              </v-icon>
              {{ $t('yes') }}
            </v-btn>
          </v-col>
          <v-col>
            <v-btn tile block class="primary white--text" @click="back()">
              <v-icon left>
                cancel
              </v-icon>
              {{ $t('no') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: mapGetters({
    logout: 'logout/getLogout'
  }),
  methods: {
    logoutUser() {
      this.$auth.logout().then(() => {
        this.$router.push('/')
        this.$store.commit('logout/setLogout', false)
      })
    },
    back() {
      this.$store.commit('logout/setLogout', false)
    }
  }
}
</script>

<style>
.v-dialog {
  overflow: hidden;
}
</style>
