<template>
  <address-create v-model="address" @input="update" />
</template>

<script>
import AddressCreate from '@/components/address/create'
import AddressById from '@/graphql/query/address/addressById.graphql'
import edit from '@/graphql/mutation/config/address/edit.graphql'
import list from '@/graphql/query/address/list.graphql'
import ggl from 'graphql-tag'
export default {
  components: {
    AddressCreate
  },
  asyncData({ app, params }) {
    const id = params.id
    return app.$apollo
      .query({
        query: ggl(AddressById),
        variables: {
          id
        }
      })
      .then(response => {
        return {
          address: response.data.AddressById
        }
      })
  },
  methods: {
    update(address) {
      this.$apollo
        .mutate({
          mutation: ggl(edit),
          variables: {
            id: address.id,
            address: {
              name: address.name,
              cep: address.cep,
              street: address.street,
              state: address.state,
              city: address.city,
              country: address.country
            }
          },
          awaitRefetchQueries: true,
          refetchQueries: [{ query: ggl(list) }]
        })
        .then(() => {
          this.$toast.show(this.$t('updated'), {
            duration: 1000,
            icon: 'done'
          })
          this.$router.push('/config/address/list')
        })
    }
  }
}
</script>

<style>
</style>
