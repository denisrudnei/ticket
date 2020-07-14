<template>
  <create @input="create" />
</template>

<script>
import ggl from 'graphql-tag'
import create from '@/components/ticket/sla/create'
import createSla from '@/graphql/mutation/config/sla/createSla.graphql'
import slaList from '@/graphql/query/config/sla/slaList.graphql'
export default {
  components: {
    create
  },
  methods: {
    create(sla) {
      const [hour, minutes] = sla.limit.split(':')

      this.$apollo
        .mutate({
          mutation: ggl(createSla),
          variables: {
            sla: {
              name: sla.name,
              limit: new Date(
                Date.UTC(1970, 0, 1, parseInt(hour), parseInt(minutes))
              )
            }
          },
          awaitRefetchQueries: true,
          refetchQueries: [{ query: ggl(slaList) }]
        })
        .then(() => {
          this.$toast.show('Cadastrado com sucesso', {
            duration: 1000,
            icon: 'done'
          })
        })
    }
  }
}
</script>

<style>
</style>
