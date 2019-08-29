<template>
  <create-group v-model="group" @input="update" />
</template>

<script>
import CreateGroup from '@/components/ticket/group/create'
export default {
  components: {
    CreateGroup
  },
  asyncData({ $axios, params }) {
    const id = params.id
    return $axios.get(`/group/${id}`).then(response => {
      return {
        group: response.data
      }
    })
  },
  methods: {
    update(group) {
      this.$axios.put(`/config/group/${group._id}`, group).then(() => {
        this.$toast.show('Atualizado', {
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
