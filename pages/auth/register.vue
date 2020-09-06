<template>
  <v-form>
    <v-text-field
      v-model="user.email"
      solo
      :label="$t('email')"
    />
    <v-alert
      v-if="errors.email"
      v-model="errors.email"
    >
      {{ errors.email.message }}
    </v-alert>
    <v-text-field
      v-model="user.name"
      solo
      :label="$t('exhibition_name')"
    />
    <v-alert
      v-if="errors.name"
      v-model="errors.name"
    >
      {{ errors.name.message }}
    </v-alert>
    <v-text-field
      v-model="user.password"
      solo
      :label="$t('password')"
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
      tile
      :block="onMobile"
      class="primary white--text"
      @click="register()"
    >
      {{ $t('register') }}
      <v-icon right>
        save
      </v-icon>
    </v-btn>
  </v-form>
</template>

<script>
import register from '@/graphql/mutation/auth/register';

export default {
  auth: false,
  data() {
    return {
      errors: {},
      user: {
        email: '',
        name: '',
        password: '',
      },
    };
  },
  computed: {
    onMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    },
  },
  methods: {
    register() {
      this.$apollo
        .mutate({
          mutation: register,
          variables: this.user,
        })
        .then(() => {
          this.errors = {};
          this.$toast.show('Cadastrado com sucesso', {
            duration: 5000,
            icon: 'done',
          });
          this.$router.push('/auth/login');
        })
        .catch((response) => {
          this.$toast.error('Falha ao realizar registro', {
            icon: 'error',
            duration: 1000,
          });
        });
    },
  },
};
</script>

<style></style>
