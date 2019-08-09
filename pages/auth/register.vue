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
          box
          label="Email"
        />
        <v-alert
          v-if="errors.email"
          v-model="errors.email"
        >
          {{ errors.email.message }}
        </v-alert>
        <v-text-field
          v-model="user.name"
          box
          label="Nome de exibição"
        />
        <v-alert
          v-if="errors.name"
          v-model="errors.name"
        >
          {{ errors.name.message }}
        </v-alert>
        <v-text-field
          v-model="user.password"
          box
          label="Senha"
          type="password"
        />
        <v-alert
          v-if="errors.password"
          v-model="errors.password"
        >
          {{ errors.password.message }}
        </v-alert>
        <v-btn
          large
          :block="onMobile"
          class="primary white--text"
          @click="register()"
        >
          Registrar
          <v-icon right>
            save
          </v-icon>
        </v-btn>
        <v-btn
          large
          :block="onMobile"
          class="primary white--text"
          to="/auth/login"
        >
          Logar
          <v-icon right>
            person
          </v-icon>
        </v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  auth: false,
  data() {
    return {
      errors: {},
      user: {
        email: '',
        name: '',
        password: ''
      }
    }
  },
  computed: {
    onMobile() {
      return this.$vuetify.breakpoint.xsOnly
    }
  },
  methods: {
    register() {
      this.$axios.post('/auth/register', this.user).then(
        () => {
          this.errors = {}
          this.$toast.show('Cadastrado com sucesso', {
            duration: 5000,
            icon: 'done'
          })
          this.$router.push('/auth/login')
        },
        error => {
          if (error.response.data.errors) {
            this.errors = error.response.data.errors
          } else {
            this.$toast.error('Falha ao realizar registro', {
              icon: 'error',
              duration: 1000
            })
          }
        }
      )
    }
  }
}
</script>

<style>
</style>
