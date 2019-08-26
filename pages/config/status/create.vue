<template>
  <status-create @input="save" />
</template>

<script>
import StatusCreate from '@/components/ticket/status/create'

export default {
  components: {
    StatusCreate
  },
  methods: {
    save(status) {
      this.$axios.post('/config/status', status).then(() => {
        this.$toast.show('Status criado', {
          duration: 1000
        })
      })
    }
  }
}
</script>

<style>
</style>
