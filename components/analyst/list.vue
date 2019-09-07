<template>
  <v-card>
    <v-card-title>
      Encontrados
    </v-card-title>
    <v-card-text>
      <v-list two-line>
        <v-list-item v-for="analyst in analysts" :key="analyst._id" :to="`/analyst/${analyst._id}`">
          <v-list-item-avatar>
            <v-avatar>
              <v-img :src="analyst.picture" />
            </v-avatar>
          </v-list-item-avatar>
          {{ analyst.name }}
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: mapGetters({
    analysts: 'analyst/getSearchedAnalysts'
  })
}
</script>

<style>
</style>
