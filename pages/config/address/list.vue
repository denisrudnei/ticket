<template>
  <v-row>
    <v-col>
      <v-data-table
        :headers="headers"
        :items="addresses"
      >
        <template #item.name="{ item }">
          {{ item.name }}
        </template>
        <template #item.street="{ item }">
          {{ item.street }}
        </template>
        <template #item.state="{ item }">
          {{ item.state }}
        </template>
        <template #item.city="{ item }">
          {{ item.city }}
        </template>
        <template #item.country="{ item }">
          {{ item.country }}
        </template>
        <template #item.edit="{ item }">
          <v-btn
            class="primary white--text"
            icon
            :to="`/config/address/edit/${item.id}`"
          >
            <v-icon>edit</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import addressList from '@/graphql/query/address/list';

export default {
  data() {
    return {
      addresses: [],
    };
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t('name'),
          value: 'name',
        },
        {
          text: this.$t('state'),
          value: 'state',
        },
        {
          text: this.$t('city'),
          value: 'city',
        },
        {
          text: this.$t('street'),
          value: 'street',
        },
        {
          text: this.$t('country'),
          value: 'country',
        },
        {
          text: this.$t('edit'),
          value: 'edit',
        },
      ];
    },
  },
  created() {
    this.$apollo
      .query({
        query: addressList,
      })
      .then((response) => {
        this.addresses = response.data.Address;
      });
  },
};
</script>

<style></style>
