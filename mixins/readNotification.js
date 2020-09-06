import read from '~/graphql/mutation/profile/notification/read.ts';

export default {
  methods: {
    readNotification(notification) {
      const { id } = notification;
      this.$apollo
        .mutate({
          mutation: read,
          variables: {
            id,
          },
        })
        .then((response) => {
          this.$store.commit(
            'notification/updateNotification',
            response.data.notification,
          );
          this.$toast.show(this.$t('read'), {
            duration: 1000,
          });
        });
    },
  },
};
