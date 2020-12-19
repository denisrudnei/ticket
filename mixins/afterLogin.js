import mergeUser from '~/graphql/mutation/auth/mergeUser';

export default {
  computed: {
    user() {
      return this.$auth.user;
    },
  },
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
          this.$store.commit('user/setUser', response.data.MergeUser);
          const { color } = response.data.MergeUser;
          this.changeColor(color);
        });
    },
  },
};
