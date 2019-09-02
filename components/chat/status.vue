<template>
  <v-card>
    <v-select :value="user.status" :items="status" filled label="Status online" @change="changeStatus" />
  </v-card>
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
