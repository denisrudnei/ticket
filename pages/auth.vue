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
    <v-col
      cols="12"
      md="4"
      pa-3
    >
      <v-card>
        <v-card-text>
          <v-row>
            <v-col
              cols="12"
              pa-3
            >
              <v-btn
                large
                block
                tile
                class="primary white--text"
                to="/auth/login"
              >
                {{ $t('login') }}
                <v-icon right>
                  person
                </v-icon>
              </v-btn>
            </v-col>
            <v-col
              cols="12"
              pa-3
            >
              <v-btn
                large
                block
                tile
                class="primary white--text"
                @click="login()"
              >
                {{ $t('external_login') }}
                <v-icon right>
                  import_export
                </v-icon>
              </v-btn>
            </v-col>
            <v-col
              cols="12"
              pa-3
            >
              <v-btn
                large
                block
                tile
                class="primary white--text"
                to="/auth/reset"
              >
                {{ $t('reset_password') }}
                <v-icon right>
                  lock
                </v-icon>
              </v-btn>
            </v-col>
            <v-col
              cols="12"
              pa-3
            >
              <v-btn
                large
                block
                tile
                class="primary white--text"
                to="/auth/register"
              >
                {{ $t('register') }}
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

export default {
  methods: {
    login() {
      this.$auth.loginWith('auth0').catch((e) => {
        this.$toast.error('Falha ao logar', {
          duration: 1000,
          icon: 'error',
        });
      });
    },
  },
};
</script>

<style></style>
