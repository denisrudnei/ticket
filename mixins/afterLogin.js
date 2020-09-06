import { mapGetters } from 'vuex';
import mergeUser from '~/graphql/mutation/auth/mergeUser.ts';

export default {
  computed: mapGetters({
    user: 'auth/getUser',
  }),
  methods: {
    changeColor(color) {
      this.$vuetify.theme.currentTheme.primary = color || this.$vuetify.theme.currentTheme.primary;
    },
    processInfo() {
      const {
        email, name, status, contactEmail, description,
      } = this.user;
      const user = {
        email, name, status, contactEmail, description,
      };
      this.$apollo
        .mutate({
          mutation: mergeUser,
          variables: {
            email: this.user.email,
            user,
          },
        })
        .then((response) => {
          this.$store.commit('auth/setUser', response.data.MergeUser);
          const { color } = response.data.MergeUser;
          this.changeColor(color);
        });
    },
  },
};
