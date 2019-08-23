<template>
  <v-row>
    <v-col
      cols="12"
      pa-3
    >
      <v-form>
        <v-text-field
          v-model="group.name"
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
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      group: {
        name: ''
      }
    }
  },
  methods: {
    save() {
      this.$axios.post('/config/group', this.group).then(() => {
        this.$toast.show('Grupo criado', {
          duration: 1000
        })
      })
    }
  }
}
</script>

<style>
</style>
