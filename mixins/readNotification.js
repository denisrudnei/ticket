import ggl from 'graphql-tag'
import read from '@/graphql/mutation/profile/notification/read.graphql'
export default {
  methods: {
    readNotification(notification) {
      const id = notification._id
      this.$apollo
        .mutate({
          mutation: ggl(read),
          variables: {
            _id: id
          }
        })
        .then(response => {
          this.$store.commit(
            'notification/updateNotification',
            response.data.notification
          )
          this.$toast.show(this.$t('read'), {
            duration: 1000
          })
        })
    }
  }
}
