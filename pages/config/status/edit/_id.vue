<template>
  <create-status v-model="status" @input="update" />
</template>

<script>
import CreateStatus from '@/components/ticket/status/create'
export default {
  components: {
    CreateStatus
  },
  asyncData({ $axios, params }) {
    const id = params.id
    return $axios.get(`/status/${id}`).then(response => {
      return {
        status: response.data
      }
    })
  },
  methods: {
    update(status) {
      this.$axios.put(`/config/status/${status.id}`, status).then(() => {
        this.$toast.show('Atualizado', {
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
