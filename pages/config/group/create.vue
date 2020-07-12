<template>
  <create-group @input="save" />
</template>

<script>
import CreateGroup from '@/components/ticket/group/create'
import create from '@/graphql/mutation/config/group/create.graphql'
import ggl from 'graphql-tag'
export default {
  components: {
    CreateGroup
  },
  methods: {
    save(group) {
      this.$apollo
        .mutate({
          mutation: ggl(create),
          variables: {
            group
          }
        })
        .then(() => {
          this.$toast.show('Grupo criado', {
            duration: 1000
          })
          this.$router.push('/config/group')
        })
    }
  }
}
</script>

<style>
</style>
