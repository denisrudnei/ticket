<template>
  <v-form>
    <v-row>
      <v-col
        cols="12"
        md="8"
        pa-3
      >
        <v-text-field
          v-model="user.name"
          filled
          label="Nome para exibição"
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
          v-model="user.address"
          filled
          label="Localização"
          :items="
            addresses.map((a) => ({
              text: `${a.name} | ${a.city}, ${a.state} - ${a.country}`,
              value: a,
            }))
          "
          :value-comparator="compare"
          @change="updateAddress"
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-card>
          <v-card-title primary-title>
            <div class="healine text-center">
              <span>
                Proporção de chamados resolvidos
              </span>
            </div>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="4"
                pa-3
              >
                <v-progress-circular
                  :value="(info.opened / info.total) * 100"
                  :size="125"
                  width="10"
                  rotate="90"
                  color="green"
                >
                  <v-avatar size="110">
                    <v-img :src="user.picture" />
                  </v-avatar>
                </v-progress-circular>
              </v-col>
              <v-col
                cols="8"
                pa-3
              >
                <v-card-text class="text-center">
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
      <v-col
        cols="12"
        pa-3
      >
        <v-menu :close-on-content-click="false">
          <template #activator="{ on }">
            <v-btn
              tile
              class="primary white--text"
              v-on="on"
            >
              Cor primária
            </v-btn>
          </template>
          <v-color-picker
            v-model="primary"
            mode="hexa"
          />
        </v-menu>
        <v-btn
          tile
          class="primary white--text"
          @click="openImageSelection()"
        >
          <v-icon left>
            image
          </v-icon>
          {{ $t('select_profile_image') }}
        </v-btn>
        <v-btn
          tile
          class="primary white--text"
          @click="removeImage()"
        >
          <v-icon left>
            delete
          </v-icon>
          {{ $t('remove_image') }}
        </v-btn>
        <input
          ref="profileImage"
          type="file"
          style="display: none;"
          accept="image/*"
          @change="updateImage()"
        >
      </v-col>
      <v-col
        cols="12"
        pa-3
      >
        <v-switch
          :input-value="user.mergePictureWithExternalAccount"
          label="Atualizar imagem com conta externa automaticamente"
          @change="updatePictureMerge"
        />
        <v-switch
          color="primary"
          :label="$t('receive_email_notification')"
        />
      </v-col>
    </v-row>
    <v-btn
      text
      class="primary white--text"
      @click="save()"
    >
      {{ $t('save_configurations') }}
    </v-btn>
  </v-form>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import compareObjectsWithId from '@/mixins/compareObjectsWithId';

import AddressList from '@/graphql/query/address/list';
import profileInfo from '@/graphql/query/profile/list';
import update from '@/graphql/mutation/profile/analyst/update';
import removeImage from '@/graphql/mutation/profile/analyst/removeImage';

export default {
  mixins: [compareObjectsWithId],
  data() {
    return {
      addresses: [],
      user: {},
      primary: '#FFFFFF',
      info: {},
    };
  },
  computed: mapGetters({
    groups: 'group/getGroups',
  }),
  watch: {
    primary(value) {
      this.updatePrimary();
    },
  },
  created() {
    this.$apollo.query({
      query: profileInfo,
    })
      .then((response) => {
        this.addresses = response.data.address;
        this.info = response.data.ProfileInfo;
        this.user = response.data.user;
      });
  },
  methods: {
    ...mapMutations({
      updateEmail: 'auth/updateEmail',
      updateAddress: 'auth/updateAddress',
    }),
    updatePrimary() {
      this.$vuetify.theme.currentTheme.primary = this.primary;
      this.$store.commit('auth/setColor', this.primary);
      this.user.color = this.primary;
    },
    updatePictureMerge(value) {
      this.$store.commit('auth/updateMergePictureWithExternalAccount', value);
    },
    save() {
      const {
        name, contactEmail, color, description,
      } = this.user;
      const analyst = {
        name,
        contactEmail,
        color,
        description,
        address: this.user.address ? this.user.address.id : null,
      };
      this.$apollo
        .mutate({
          mutation: update,
          variables: {
            analyst,
          },
        })
        .then(() => {
          this.$toast.show('Salvo com êxito', {
            duration: 1000,
            icon: 'update',
          });
        });
    },
    openImageSelection() {
      this.$refs.profileImage.click();
    },
    removeImage() {
      this.$apollo
        .mutate({
          mutation: removeImage,
        })
        .then(() => {
          this.$store.commit('auth/removeImage');
          this.$toast.show('Imagem removida com sucesso', {
            duration: 5000,
            icon: 'done',
          });
        }).catch(() => {
          this.$toast.error('Falha ao realizar a remoção da imagem de perfil');
        });
    },
    updateImage() {
      if (!this.$refs.profileImage.files[0]) return;
      const fileReader = new FileReader();
      fileReader.addEventListener('loadend', () => {
        this.user.picture = fileReader.result;
      });
      fileReader.readAsDataURL(this.$refs.profileImage.files[0]);
      const formData = new FormData();
      formData.append('image', this.$refs.profileImage.files[0]);
      this.$axios.put('/analyst/image', formData).then(() => {
        this.$toast.show('Imagem enviada ao servidor', {
          duration: 5000,
          icon: 'done',
        });
      }).catch(() => {
        this.$toast.error('Falha ao upar imagem no servidor');
      });
    },
  },
};
</script>

<style scoped>
span {
  word-break: break-word !important;
}
</style>
