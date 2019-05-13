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
        v-model="role.name"
        label="Nome [não pode ser alterado]"
        box
        placeholder="Nome"
        readonly
      />
    </v-flex>
    <v-flex
      xs12
      pa-2
    >
      <v-text-field
        v-model="role.description"
        label="Descrição"
        box
        placeholder="Descrição"
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
  data() {
    return {
      role: null
    }
  },
  computed: mapGetters({
    roles: 'role/getRoles'
  }),
  created() {
    const id = this.$router.currentRoute.params.id
    this.$store.dispatch('role/downloadRoles')
    this.role = this.roles.find(r => {
      return r._id === id
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
