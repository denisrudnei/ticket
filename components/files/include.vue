<template>
  <div>
    <v-file-input
      v-model="selectFiles"
      multiple
      :label="$t('add_file')"
      @change="selectFile"
    />
    <v-row>
      <v-col
        cols="12"
        pa-3
      >
        <v-data-table
          :items="filePreview"
          :headers="headers"
        >
          <template #item.preview="{ item }">
            <v-img
              :src="item.data || item.url"
              @click="setActivePreview(item.data || item.url)"
            />
            <audio
              v-if="item.type.includes('audio')"
              :src="item.data || item.url"
              controls
            />
          </template>
          <template #item.link="{ item }">
            <td v-if="item.old">
              <nuxt-link
                target="_blank"
                :to="`/api/ticket/${item.name}/file`"
              >
                {{ item.name }}
              </nuxt-link>
            </td>
          </template>
          <template #item.name="{ item }">
            {{ item.name }}
          </template>
          <template #item.old="{ item }">
            <v-checkbox
              v-model="item.old"
              readonly
            />
          </template>
          <template #item.type="{ item }">
            {{ item.type }}
          </template>
          <template #item.remove="{ item }">
            <v-btn
              icon
              class="red white--text"
              @click="removeFile(item)"
            >
              <v-icon>
                delete
              </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
      <v-col
        cols="12"
        pa-3
      >
        <v-btn
          tile
          :disabled="files.length === 0"
          class="primary--text"
          @click="sendFiles()"
        >
          {{ $t('send_files') }}
          <v-icon right>
            send
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-dialog
      v-model="active"
      scrollable
    >
      <v-card>
        <v-toolbar
          color="primary white--text"
          dark
        >
          <v-toolbar-items>
            <v-btn
              icon
              @click="setActivePreview('')"
            >
              <v-icon>
                close
              </v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-title>
          <nuxt-link
            target="_blank"
            :to="`/api/ticket/${activeName}/file`"
          >
            <img
              :src="activeName"
              width="100%"
              style="max-height: 100%;"
            >
          </nuxt-link>
        </v-card-title>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      selectFiles: null,
      active: false,
      activeName: '',
    };
  },
  computed: {
    headers() {
      return [
        {
          text: 'Preview',
          value: 'preview',
        },
        {
          text: 'Link',
          value: 'link',
        },
        {
          text: this.$t('name'),
          value: 'name',
        },
        {
          text: this.$t('attached'),
          value: 'old',
        },
        {
          text: this.$t('type'),
          value: 'type',
        },
        {
          text: this.$t('remove'),
          value: 'remove',
        },
      ];
    },
    ...mapGetters({
      files: 'file/getFiles',
      filePreview: 'file/getFilePreview',
      dialog: 'ticket/getDialog',
      ticket: 'ticket/getActualTicket',
    }),
  },
  watch: {
    dialog(value) {
      this.updateFiles();
    },
    ticket(value) {
      this.updateFiles();
    },
  },
  mounted() {
    this.updateFiles();
  },
  methods: {
    setActivePreview(name) {
      this.active = name !== '';
      this.activeName = name;
    },
    updateFiles() {
      if (this.ticket.files === undefined) return;
      this.$store.commit(
        'file/setFilePreview',
        this.ticket.files.map((f) => ({
          ...f,
          old: true,
        })),
      );
    },
    selectFile(value) {
      this.$store.commit('file/setFiles', this.selectFiles);
      const vue = this;
      Object.keys(this.files).forEach((file) => {
        file = this.files[file];
        const fileReader = new FileReader();
        const { type } = file;
        const preview = {
          type,
          name: file.name,
        };
        fileReader.onloadend = function load() {
          vue.$store.commit('file/addFilePreview', {
            data: fileReader.result,
            ...preview,
          });
        };
        const types = ['image', 'audio'];
        const find = types.findIndex((t) => type.includes(t));
        if (find !== -1) {
          fileReader.readAsDataURL(file);
        } else {
          vue.$store.commit('file/addFilePreview', preview);
        }
      });
    },
    removeFile(file) {
      if (file.old) {
        this.removeFileInServer(file);
      }
      const files = Object.values(this.files).filter((v) => v.name !== file.name);
      const filePreview = this.filePreview.filter((f) => f.name !== file.name);
      this.$store.commit('file/setFilePreview', filePreview);
      this.$store.commit('file/setFiles', files);
    },
    sendFiles() {
      const formData = new FormData();
      const files = Object.values(this.files).filter((v) => !v.old);
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        formData.append(`files[${i}]`, file);
      }

      this.$axios
        .post(`/ticket/${this.ticket.id}/file`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          this.$toast.show('Enviado com sucesso', {
            duration: 1000,
          });
          this.$store.commit('file/setFiles', response.data);
        });
    },
    removeFileInServer(file) {
      this.$axios
        .delete(`/ticket/${this.ticket.id}/${file.name}/file`)
        .then(() => {
          const files = this.ticket.files.filter((f) => f.name !== file.name);
          this.$store.commit('file/setFiles', files);
        });
    },
  },
};
</script>
<style scoped>
.v-image {
  width: 15vw;
  position: relative;
}
</style>
