import { mapGetters } from 'vuex';
import ggl from 'graphql-tag';
import mergeUser from '@/graphql/mutation/auth/mergeUser.graphql';

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
          mutation: ggl(mergeUser),
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
