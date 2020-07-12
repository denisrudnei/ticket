<template>
  <create-group v-model="group" @input="update" />
</template>

<script>
import CreateGroup from '@/components/ticket/group/create'
import GetGroup from '@/graphql/query/config/group/getGroup.graphql'
import EditGroup from '@/graphql/mutation/config/group/editGroup.graphql'
import ggl from 'graphql-tag'
export default {
  components: {
    CreateGroup
  },
  asyncData({ app, params }) {
    const id = params.id

    return app.$apollo
      .query({
        query: ggl(GetGroup),
        variables: {
          id
        }
      })
      .then(response => {
        return {
          group: response.data.group
        }
      })
  },
  methods: {
    update(group) {
      this.$apollo
        .mutate({
          mutation: ggl(EditGroup),

          variables: {
            groupId: group.id,
            group: {
              name: group.name,
              description: group.description,
              analysts: group.analysts.map(analyst => analyst.id)
            }
          }
        })
        .then(() => {
          this.$toast.show(this.$t('updated'), {
            duration: 5000,
            icon: 'done'
          })
          this.$router.push('/config/group')
        })
    }
  }
}
</script>

<style>
</style>
