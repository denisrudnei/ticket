<template>
  <create-status v-model="status" @input="update" />
</template>

<script>
import CreateStatus from '@/components/ticket/status/create'
import StatusById from '@/graphql/query/status/statusById.graphql'
import list from '@/graphql/query/status/list.graphql'
import edit from '@/graphql/mutation/config/status/edit.graphql'
import ggl from 'graphql-tag'
export default {
  components: {
    CreateStatus
  },
  asyncData({ app, params }) {
    const id = params.id
    return app.$apollo
      .query({
        query: ggl(StatusById),
        variables: {
          id
        }
      })
      .then(response => {
        return {
          status: response.data.FindStatus
        }
      })
  },
  methods: {
    update(status) {
      this.$apollo
        .mutate({
          mutation: ggl(edit),
          variables: {
            id: status.id,
            status: {
              name: status.name,
              description: status.description,
              allowedStatus: status.allowedStatus.map(status => status.id),
              slaRun: status.slaRun
            }
          },
          awaitRefetchQueries: true,
          refetchQueries: [{ query: ggl(StatusById) }, { query: ggl(list) }]
        })
        .then(() => {
          this.$toast.show(this.$t('updated'), {
            duration: 1000,
            icon: 'done'
          })
          this.$router.push('/config/status/')
        })
    }
  }
}
</script>

<style>
</style>
