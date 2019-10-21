<template>
  <v-row>
    <v-col cols="4">
      <v-text-field :value="ticket.status.name" readonly filled label="Status" />
    </v-col>
    <v-col cols="4">
      <v-text-field :value="ticket.group.name" readonly filled label="Grupo atual" />
    </v-col>
    <v-col cols="4">
      <v-text-field :value="ticket.actualUser.name" readonly filled label="Analista atual" />
    </v-col>
    <v-col cols="12">
      <v-text-field :value="ticket.resume" readonly filled label="Resumo" />
    </v-col>
    <v-col cols="12">
      <v-text-field :value="ticket.content" readonly filled label="Conteúdo" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: 'client',
  asyncData({ $axios, params }) {
    return $axios.get(`/ticket/${params.id}`).then(response => {
      return {
        ticket: response.data
      }
    })
  }
}
</script>

<style>
</style>
