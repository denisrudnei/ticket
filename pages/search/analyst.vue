<template>
  <v-row>
    <v-col>
      <v-text-field v-model="searchName" label="Nome" filled />
      <v-autocomplete
        v-model="searchAddress"
        label="Endereço"
        filled
        :items="addresses.map((a) => ({ text: a.name, value: a }))"
      />
      <v-btn class="primary white--text" @click="reset">
        Limpar busca
      </v-btn>
    </v-col>
    <v-col>
      <analyst-list />
    </v-col>
  </v-row>
</template>

<script>
import AnalystList from '@/components/analyst/list';
import AddressList from '@/graphql/query/address/list.graphql';
import ggl from 'graphql-tag';

export default {
  components: {
    AnalystList,
  },
  data() {
    return {
      addresses: [],
    };
  },
  computed: {
    searchName: {
      get() {
        return this.$store.getters['analyst/getSearchName'];
      },
      set(value) {
        this.$store.commit('analyst/setSearchName', value);
      },
    },
    searchAddress: {
      get() {
        return this.$store.getters['analyst/getSearchAddress'];
      },
      set(value) {
        this.$store.commit('analyst/setSearchAddress', value);
      },
    },
  },
  created() {
    this.$apollo
      .query({
        query: ggl(AddressList),
      })
      .then((response) => {
        this.addresses = response.data.Address;
      });
  },
  methods: {
    reset() {
      this.$store.commit('analyst/setSearchName', '');
      this.$store.commit('analyst/setSearchAddress', '');
    },
  },
};
</script>

<style></style>
