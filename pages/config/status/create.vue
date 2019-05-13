<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
      pa-2
    >
      <v-form>
        <v-text-field
          v-model="status.name"
          placeholder="Nome"
          solo
        />
        <v-btn
          class="primary white--text"
          @click="save()"  
        >
          Salvar
        </v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      status: {
        name: ''
      }
    }
  },
  methods: {
    save() {
      this.$axios.post('/config/status', this.status).then(() => {
        this.$toast.show('Status criado', {
          duration: 1000
        })
      })
    }
  }
}
</script>

<style>
</style>
