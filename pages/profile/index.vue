<template>
  <v-form>
    <v-layout
      row
      wrap
    >
      <v-flex
        xs12
        md8
        pa-2
      >
        <v-text-field
          :value="user.name"
          box
          label="Nome para exibição"
          @change="updateName"
        />
        <v-text-field
          v-model="user.email"
          box
          label="Email"
          readonly
        />
      </v-flex>
      <v-flex
        xs12
        md4
      >
        <v-card>
          <v-layout
            row
            wrap
          >
            <v-flex
              xs4
              pa-2
            >
              <v-progress-circular
                :value="(info.opened/info.total) * 100"
                :size="125"
                width="10"
                rotate="90"
                color="green"
              >
                <v-avatar
                  size="110"
                >
                  <v-img
                    :src="user.picture"
                  />
                </v-avatar>
              </v-progress-circular>
            </v-flex>
            <v-flex
              xs8
              pa-2
            >
              <v-card-title primary-title>
                <div class="healine">
                  Proporção de chamados resolvidos
                </div>
              </v-card-title>
              <v-card-text
                class="text-xs-center"
              >
                {{ info.opened }} Resolvidos / {{ info.total }} Abertos
                <hr>
                ({{ ((info.opened / info.total) * 100).toFixed(2) }}) %
              </v-card-text>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <color-chooser
      v-model="primary"
      @input="updatePrimary()"
    >
      Cor primária
    </color-chooser>
    <v-switch
      color="primary"
      label="Receber notificações via email?"
    />
    <v-btn
      flat
      class="primary white--text"
      @click="save()"
    >
      Salvar configurações
    </v-btn>
  </v-form>
</template>

<script>
import ColorChooser from '@/components/colors/chooser'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    ColorChooser
  },
  data() {
    return {
      primary: null,
      info: {}
    }
  },
  computed: mapGetters({
    user: 'auth/getUser',
    groups: 'group/getGroups'
  }),
  created() {
    this.$axios.get('/profile').then(response => {
      this.info = response.data
    })
  },
  methods: {
    ...mapMutations({
      updateName: 'auth/updateName'
    }),
    updatePrimary() {
      this.$vuetify.theme.primary = this.primary
      this.$store.commit('auth/setColor', this.primary)
    },
    save() {
      this.$axios.put('/analyst', this.user).then(() => {
        this.$toast.show('Salvo com êxito', {
          duration: 1000,
          icon: 'update'
        })
      })
    }
  }
}
</script>

<style>
</style>
