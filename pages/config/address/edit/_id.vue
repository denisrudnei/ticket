<template>
  <address-create
    v-model="address"
    @input="update"
  />
</template>

<script>
import AddressCreate from '@/components/address/create';
import AddressById from '@/graphql/query/address/addressById';
import edit from '@/graphql/mutation/config/address/edit';
import list from '@/graphql/query/address/list';

export default {
  components: {
    AddressCreate,
  },
  asyncData({ app, params }) {
    const { id } = params;
    return app.$apollo
      .query({
        query: AddressById,
        variables: {
          id,
        },
      })
      .then((response) => ({
        address: response.data.AddressById,
      }));
  },
  methods: {
    update(address) {
      this.$apollo
        .mutate({
          mutation: edit,
          variables: {
            id: address.id,
            address: {
              name: address.name,
              cep: address.cep,
              street: address.street,
              state: address.state,
              city: address.city,
              country: address.country,
            },
          },
          awaitRefetchQueries: true,
          refetchQueries: [{ query: list }],
        })
        .then(() => {
          this.$toast.show(this.$t('updated'), {
            duration: 1000,
            icon: 'done',
          });
          this.$router.push('/config/address/list');
        });
    },
  },
};
</script>

<style></style>
