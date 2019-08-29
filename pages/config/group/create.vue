<template>
  <create-group @input="save" />
</template>

<script>
import CreateGroup from '@/components/ticket/group/create'
export default {
  components: {
    CreateGroup
  },
  methods: {
    save(group) {
      this.$axios.post('/config/group', group).then(() => {
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
