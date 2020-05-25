<template>
  <address-create v-model="address" @input="update" />
</template>

<script>
import AddressCreate from '@/components/address/create'
export default {
  components: {
    AddressCreate
  },
  asyncData({ $axios, params }) {
    const id = params.id
    return $axios.get(`/address/${id}`).then(response => {
      return {
        address: response.data
      }
    })
  },
  methods: {
    update(address) {
      this.$axios.put(`/address/${address.id}`, address).then(() => {
        this.$toast.show('Atualizado', {
          duration: 1000,
          icon: 'done'
        })
      })
      this.$router.push('/config/address/list')
    }
  }
}
</script>

<style>
</style>
