<template>
  <v-layout row wrap>
    <v-flex px-2>
      <v-card>
        <v-card-text>
          <v-select :value="user.status" :items="status" box label="Status online" @change="changeStatus" />
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      status: [
        {
          value: 'online',
          text: 'Disponível'
        },
        {
          value: 'busy',
          text: 'Ocupado'
        },
        {
          value: 'away',
          text: 'Ausente'
        },
        {
          value: 'offline',
          text: 'Desconectado'
        }
      ]
    }
  },
  computed: mapGetters({
    user: 'auth/getUser'
  }),
  methods: {
    changeStatus(status) {
      this.$axios
        .put('/chat/status', {
          status: status
        })
        .then(() => {
          this.$toast.show('Atualizado', {
            duration: 1000,
            icon: 'done'
          })
        })
    }
  }
}
</script>

<style>
</style>
