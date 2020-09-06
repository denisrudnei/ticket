<template>
  <v-form>
    <v-text-field
      v-model="email"
      type="email"
      solo
      :placeholder="$t('you_registered_email')"
    />
    <v-btn
      class="primary white--text"
      tile
      @click="reset()"
    >
      {{ $t('send_email') }}
      <v-icon right>
        mail
      </v-icon>
    </v-btn>
  </v-form>
</template>

<script>
import sendEmailToReset from '@/graphql/mutation/auth/sendEmailToReset';

export default {
  auth: false,
  data() {
    return {
      email: '',
    };
  },
  methods: {
    reset() {
      this.$apollo
        .mutate({
          mutation: sendEmailToReset,
          variables: {
            email: this.email,
          },
        })
        .then(() => {
          this.showMessage();
        })
        .catch(() => {
          this.$toast.error('Falha ao mandar email de reset', {
            duration: 10000,
            icon: 'error',
          });
        });
    },
    showMessage() {
      this.$toast.show('Solicitado reset, verifique sua caixa de e-mail', {
        duration: 10000,
        icon: 'done',
      });
    },
  },
};
</script>

<style></style>
