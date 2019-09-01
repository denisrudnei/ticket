<template>
  <address-create @input="save" />
</template>

<script>
import AddressCreate from '@/components/address/create'
export default {
  components: {
    AddressCreate
  },
  methods: {
    save(address) {
      this.$axios.post('/address', address).then(
        () => {
          this.$toast.show('Criado com sucesso', {
            duration: 1000,
            icon: 'done'
          })
          this.$router.push('/config/address/list')
        },
        () => {
          this.$toast.error('Falha ao cadastrar/inserir', {
            duration: 1000,
            icon: 'error'
          })
        }
      )
    }
  }
}
</script>

<style>
</style>
