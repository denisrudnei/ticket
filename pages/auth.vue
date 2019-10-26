<template>
  <v-row>
    <v-col
      cols="12"
      md="8"
      pa-5
    >
      <v-card>
        <v-card-text>
          <nuxt-child />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="4" pa-3>
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="12" pa-3>
              <v-btn
                large
                block
                tile
                class="primary white--text"
                to="/auth/login"
              >
                Logar
                <v-icon
                  right
                >
                  person
                </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12" pa-3>
              <v-btn
                large
                block
                tile
                class="primary white--text"
                @click="login()"
              >
                Login externo
                <v-icon right>
                  import_export
                </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12" pa-3>
              <v-btn
                large
                block
                tile
                class="primary white--text"
                to="/auth/reset"
              >
                Resetar senha
                <v-icon right>
                  lock
                </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12" pa-3>
              <v-btn
                large
                block
                tile
                class="primary white--text"
                to="/auth/register"
              >
                Registrar
                <v-icon right>
                  create
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: mapGetters({
    logged: 'auth/getLoggedIn'
  }),
  watch: {
    logged() {
      this.verifyPath()
    }
  },
  mounted() {
    this.verifyPath()
  },
  methods: {
    verifyPath() {
      const path = /^\/auth\/+(|login|login\/)$/
      if (path.test(this.$router.currentRoute.path) && this.logged) {
        this.$router.push('/')
      }
    },
    login() {
      this.$auth.loginWith('auth0').catch(e => {
        this.$toast.error('Falha ao logar', {
          duration: 1000,
          icon: 'error'
        })
      })
    }
  }
}
</script>

<style>
</style>
