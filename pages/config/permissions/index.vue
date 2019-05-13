<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
      pa-2
    >
      <v-data-table
        :items="roles"
        :headers="headers"
      >
        <template
          slot="items"
          slot-scope="data"
        >
          <td>
            {{ data.item.name }}
          </td>
          <td>
            {{ data.item.description }}
          </td>
          <td>
            <v-btn
              class="primary white--text"
              icon
              :to="`/config/permissions/edit/${data.item._id}`"
            >
              <v-icon>
                edit
              </v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
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
          value: 'edit'
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
