<template>
  <v-layout row wrap>
    <v-flex px-2>
      <v-card>
        <v-card-content>
          <v-select v-model="actualStatus" :items="status" box label="Status onlie" @change="changeStatus()" />
        </v-card-content>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      actualStatus: '',
      status: ['Disponível', 'Ocupado', 'Ausente', 'Desconectado']
    }
  },
  methods: {
    changeStatus() {
      // TODO
    }
  }
}
</script>

<style>
</style>
