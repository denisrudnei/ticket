<template>
  <v-row>
    <v-col
      cols="12"
      pa-3
    >
      <v-data-table
        :items="roles"
        :headers="headers"
      >
        <template
          v-slot:item.name="{ item }"
        >
          {{ item.name }}
        </template>
        <template
          v-slot:item.description="{ item }"
        >
          {{ item.description }}
        </template>
        <template
          v-slot:item.actions="{ item }"
        >
          <v-btn
            class="primary white--text"
            icon
            :to="`/config/permissions/edit/${item._id}`"
          >
            <v-icon>
              edit
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      headers: [
        {
          text: 'Nome',
          value: 'name'
        },
        {
          text: 'Descrição',
          value: 'description'
        },
        {
          text: 'Ações',
          value: 'actions'
        }
      ]
    }
  },
  computed: mapGetters({
    roles: 'role/getRoles'
  }),
  mounted() {
    this.$store.dispatch('role/downloadRoles')
  }
}
</script>

<style>
</style>
