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
        <v-text-field
          :value="user.contactEmail"
          box
          label="Endereço de email para contato"
          @change="updateEmail"
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
    <v-layout row wrap>
      <v-flex xs12 pa-2>
        <color-chooser
          v-model="primary"
          @input="updatePrimary()"
        >
          Cor primária
        </color-chooser>
        <v-btn class="primary white--text" @click="openImageSelection()">
          <v-icon
            left
          >
            image
          </v-icon>
          Selecionar imagem do perfil
        </v-btn>
        <v-btn
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
      </v-flex>
      <v-flex xs12 pa-2>
        <v-switch :input-value="user.mergePictureWithExternalAccount" label="Atualizar imagem com conta externa automaticamente" @change="updatePictureMerge" />
        <v-switch
          color="primary"
          label="Receber notificações via email?"
        />
      </v-flex>
    </v-layout>
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
import { mapGetters, mapMutations } from 'vuex'
import ColorChooser from '@/components/colors/chooser'
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
      updateName: 'auth/updateName',
      updateEmail: 'auth/updateEmail'
    }),
    updatePrimary() {
      this.$vuetify.theme.primary = this.primary
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
