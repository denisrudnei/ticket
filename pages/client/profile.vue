<template>
  <v-row>
    <v-col coll="12">
      <v-row>
        <v-col cols="12" md="4">
          <v-img :src="user.picture" alt="" />
        </v-col>
        <v-col cols="12" md="8">
          <v-text-field filled :label="$t('name')" :value="user.name" readonly />
          <v-autocomplete filled label="Local" :value="user.address" :items="addresses.map(a => {return {text: a.name, value: a}})" />
          <v-file-input filled label="Trocar imagem" />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12">
      <v-btn class="primary white--text">
        <v-icon left>
          save
        </v-icon>
        {{ $t('save') }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import ggl from 'graphql-tag'
import listAddress from '@/graphql/query/client/profile/listAddress.graphql'
export default {
  layout: 'client',
  computed: mapGetters({
    user: 'auth/getUser'
  }),
  asyncData({ app }) {
    return app.$apollo
      .query({
        query: ggl(listAddress)
      })
      .then(response => {
        return {
          addresses: response.data.address
        }
      })
  }
}
</script>

<style>
</style>
