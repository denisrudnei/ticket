<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
      pa-2
    >
      <v-text-field
        label="Nome [não pode ser alterado]"
        box
        placeholder="Nome"
        v-model="role.name"
        readonly
      />
    </v-flex>
    <v-flex
      xs12
      pa-2
    >
      <v-text-field
        label="Descrição"
        box
        placeholder="Descrição"
        v-model="role.description"
      />
    </v-flex>
    <v-flex
      xs12
      pa-2
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
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: mapGetters({
    roles: 'role/getRoles'
  }),
  data() {
    return {
      role: null
    }
  },
  created() {
    const id = this.$router.currentRoute.params.id
    this.$store.dispatch('role/downloadRoles')
    this.role = this.roles.find(r => {
      return r._id === id
    })
  },
  methods: {
    save() {
      this.$axios.put(`/role/${this.role._id}`, this.role).then(() => {
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
