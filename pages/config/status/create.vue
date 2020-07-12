<template>
  <status-create @input="save" />
</template>

<script>
import StatusCreate from '@/components/ticket/status/create'
import create from '@/graphql/mutation/config/status/create.graphql'
import list from '@/graphql/query/status/list.graphql'
import ggl from 'graphql-tag'
export default {
  components: {
    StatusCreate
  },
  methods: {
    save(status) {
      const newStatus = {
        ...status,
        allowedStatus: status.allowedStatus.map(status => {
          return status.id
        })
      }
      this.$apollo
        .mutate({
          mutation: ggl(create),
          variables: {
            status: newStatus
          },
          refetchQueries: [{ query: ggl(list) }]
        })
        .then(() => {
          this.$toast.show('Status criado', {
            duration: 1000
          })
        })
      this.$router.push('/config/status/')
    }
  }
}
</script>

<style>
</style>
