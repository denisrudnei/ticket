<template>
  <v-row>
    <v-col
      cols="12"
      pa-3
    >
      <v-text-field
        v-model="role.name"
        label="Nome [não pode ser alterado]"
        filled
        placeholder="Nome"
        readonly
      />
    </v-col>
    <v-col
      cols="12"
      pa-3
    >
      <v-text-field
        v-model="role.description"
        label="Descrição"
        filled
        placeholder="Descrição"
      />
    </v-col>
    <v-col
      cols="12"
      pa-3
    >
      <v-btn
        class="primary white--text"
        @click="save()"
      >
        Salvar
        <v-icon
          right
        >
          save
        </v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      role: null
    }
  },
  computed: mapGetters({
    roles: 'role/getRoles'
  }),
  asyncData({ $axios, params }) {
    return $axios.get('/role').then(response => {
      return {
        role: response.data.find(r => {
          return r._id === params.id
        })
      }
    })
  },
  methods: {
    save() {
      this.$axios.put(`/config/role/${this.role._id}`, this.role).then(() => {
        this.$toast.show('Role ataualizada com sucesso', {
          duration: 1000,
          icon: 'verified_user'
        })
        this.$router.push('/config/permissions')
      })
    }
  }
}
</script>

<style>
</style>
