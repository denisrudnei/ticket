<template>
  <v-form>
    <v-row>
      <v-col
        cols="12"
        md="8"
        pa-3
      >
        <v-text-field
          :value="user.name"
          filled
          label="Nome para exibição"
          @change="updateName"
        />
        <v-text-field
          v-model="user.email"
          filled
          label="Email"
          readonly
        />
        <v-text-field
          :value="user.contactEmail"
          filled
          label="Endereço de email para contato"
          @change="updateEmail"
        />
        <v-select
          :value="user.address"
          filled
          label="Localização"
          :items="addresses.map(a => ({text: `${a.name} | ${a.city}, ${a.state} - ${a.country}`, value: a}))"
          @change="updateAddress"
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-card>
          <v-card-title primary-title>
            <div class="healine">
              Proporção de chamados resolvidos
            </div>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="4"
                pa-3
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
              </v-col>
              <v-col
                cols="8"
                pa-3
              >
                <v-card-text
                  class="text-center"
                >
                  {{ info.opened }} Resolvidos / {{ info.total }} Abertos
                  <hr>
                  ({{ ((info.opened / info.total) * 100).toFixed(2) }}) %
                </v-card-text>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" pa-3>
        <v-menu :close-on-content-click="false">
          <template v-slot:activator="{on}">
            <v-btn tile class="primary white--text" v-on="on">
              Cor primária
            </v-btn>
          </template>
          <v-color-picker v-model="primary" mode="hexa" />
        </v-menu>
        <v-btn tile class="primary white--text" @click="openImageSelection()">
          <v-icon
            left
          >
            image
          </v-icon>
          Selecionar imagem do perfil
        </v-btn>
        <v-btn
          tile
          class="primary white--text"
          @click="removeImage()"
        >
          <v-icon
            left
          >
            delete
          </v-icon>
          Remover imagem
        </v-btn>
        <input ref="profileImage" type="file" style="display: none" accept="image/*" @change="updateImage()">
      </v-col>
      <v-col cols="12" pa-3>
        <v-switch :input-value="user.mergePictureWithExternalAccount" label="Atualizar imagem com conta externa automaticamente" @change="updatePictureMerge" />
        <v-switch
          color="primary"
          label="Receber notificações via email?"
        />
      </v-col>
    </v-row>
    <v-btn
      text
      class="primary white--text"
      @click="save()"
    >
      Salvar configurações
    </v-btn>
  </v-form>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      primary: '#FFFFFF',
      info: {}
    }
  },
  computed: mapGetters({
    user: 'auth/getUser',
    groups: 'group/getGroups'
  }),
  watch: {
    primary: function(value) {
      this.updatePrimary()
    }
  },
  asyncData({ $axios }) {
    return $axios.get('/address').then(response => {
      return {
        addresses: response.data
      }
    })
  },
  created() {
    this.$axios.get('/profile').then(response => {
      this.info = response.data
    })
  },
  methods: {
    ...mapMutations({
      updateName: 'auth/updateName',
      updateEmail: 'auth/updateEmail',
      updateAddress: 'auth/updateAddress'
    }),
    updatePrimary() {
      this.$vuetify.theme.currentTheme.primary = this.primary
      this.$store.commit('auth/setColor', this.primary)
    },
    updatePictureMerge(value) {
      this.$store.commit('auth/updatemergePictureWithExternalAccount', value)
    },
    save() {
      this.$axios.put('/analyst', this.user).then(() => {
        this.$toast.show('Salvo com êxito', {
          duration: 1000,
          icon: 'update'
        })
      })
    },
    openImageSelection() {
      this.$refs.profileImage.click()
    },
    removeImage() {
      this.$axios.delete('/analyst/image').then(
        () => {
          this.$store.commit('auth/removeImage')
          this.$toast.show('Imagem removida com sucesso', {
            duration: 5000,
            icon: 'done'
          })
        },
        () => {
          this.$toast.error('Falha ao realizar a remoção da imagem de perfil')
        }
      )
    },
    updateImage() {
      if (!this.$refs.profileImage.files[0]) return
      const fileReader = new FileReader()
      fileReader.addEventListener('loadend', () => {
        this.$store.commit('auth/updateImage', fileReader.result)
      })
      fileReader.readAsDataURL(this.$refs.profileImage.files[0])
      const formData = new FormData()
      formData.append('image', this.$refs.profileImage.files[0])
      this.$axios.put('/analyst/image', formData).then(
        () => {
          this.$toast.show('Imagem enviada ao servidor', {
            duration: 5000,
            icon: 'done'
          })
        },
        () => {
          this.$toast.error('Falha ao upar imagem no servidor')
        }
      )
    }
  }
}
</script>

<style>
</style>
