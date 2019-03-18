<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
      pa-2
    >
      <v-tabs>
        <v-tab>
          Perfil
        </v-tab>
        <v-tab-item>
          <v-form>
            <v-layout
              row
              wrap
            >
              <v-flex
                xs8
                pa-2
              >
                <v-text-field
                  v-model="user.name"
                  box
                  label="Nome para exibição"
                />
                <v-text-field
                  v-model="user.email"
                  box
                  label="Email"
                  readonly
                />
                <v-autocomplete
                  :items="groups.map(g => ({ text: g.name, value: g }))"
                  box
                  label="Grupo principal"
                />
              </v-flex>
              <v-flex
                xs4
                pa-2
              >
                <v-img
                  :src="user.picture"
                />
              </v-flex>
            </v-layout>
            <v-switch
              color="primary"
              label="Receber notificações via email?"
            />
            <v-btn
              flat
              class="primary white--text"
            >
              Salvar configurações
            </v-btn>
          </v-form>
        </v-tab-item>
        <v-tab>
          Notificações
        </v-tab>
        <v-tab-item>
          <NotificationList />
        </v-tab-item>
      </v-tabs>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import NotificationList from '@/components/notification-list'

export default {
  components: {
    NotificationList
  },
  data() {
    return {}
  },
  computed: mapGetters({
    user: 'auth/getUser',
    groups: 'group/getGroups'
  })
}
</script>

<style>
</style>
