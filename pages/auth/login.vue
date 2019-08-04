<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
      pa-5
    >
      <v-form>
        <v-text-field
          v-model="user.email"
          placeholder="Login"
          solo
          @keypress.enter="localLogin()"
        />
        <v-text-field
          v-model="user.password"
          placeholder="Senha"
          type="password"
          solo
          @keypress.enter="localLogin()"
        />
        <v-btn
          large
          class="primary white--text"
          @click="localLogin()"
        >
          Logar
          <v-icon
            right
          >
            person
          </v-icon>
        </v-btn>
        <v-btn
          large
          class="primary white--text"
          @click="login()"
        >
          Login externo
        </v-btn>
        <v-btn
          large
          class="primary white--text"
          to="/auth/register"
        >
          Registrar
        </v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      user: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    localLogin() {
      this.$auth
        .loginWith('local', {
          data: this.user
        })
        .then(async () => {
          const loggedUser = await this.$axios.post('/auth/user')
          this.$axios
            .post('/auth/mergeUser', loggedUser.data.user)
            .then(response => {
              const user = response.data
              this.$vuetify.theme.primary =
                user.color || this.$vuetify.theme.primary
              this.$axios
                .post(`/analyst/${user._id}/groups`)
                .then(responseGroups => {
                  responseGroups.data
                    .filter(g => {
                      return g.analysts.map(a => a._id).includes(this.user._id)
                    })
                    .forEach(group => {
                      this.$socket.on(
                        `notification/${group._id}`,
                        notification => {
                          this.$store.commit(
                            'notification/addNotification',
                            notification
                          )
                        }
                      )
                    })

                  this.$socket.on('readNotification', notification => {
                    this.$store.commit(
                      'notification/updateNotification',
                      notification
                    )
                  })
                })
            })
        })
        .catch(() => {
          this.$toast.error('Falha ao logar')
        })
    },
    login() {
      this.$auth.loginWith('auth0').catch(e => {
        this.$toast.error('Falha ao logar')
      })
    }
  }
}
</script>

<style>
</style>
