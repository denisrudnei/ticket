<template>
  <div>
    <v-btn
      @click="activateFile()"
    >
      Incluir arquivo
      <v-icon>
        attach_file
      </v-icon>
    </v-btn>
    <input
      ref="filePicker"
      style="display: none"
      multiple
      type="file"
      @change="selectFile()"
    >
    <v-layout
      row
      wrap
    >
      <v-flex
        xs12
        pa-2
      >
        <v-data-table
          :items="filePreview"
          :headers="fileHeaders"
        >
          <template
            v-slot:items="{ item }"
          >
            <td>
              <v-img
                v-if="item.type.includes('image')"
                :src="item.data || `/api/ticket/${item.name}/file`"
              />
              <audio
                v-if="item.type.includes('audio')"
                :src="item.data"
                controls
              />
            </td>
            <td v-if="item.old">
              <nuxt-link
                target="_blank"
                :to="`/api/ticket/${item.name}/file`"
              >
                {{ item.name }}
              </nuxt-link>
            </td>
            <td v-if="!item.old">
              {{ item.name }}
            </td>
            <td>
              <v-checkbox
                v-model="item.old"
                readonly
              />
            </td>
            <td>{{ item.type }}</td>
            <td>
              <v-btn
                icon
                class="red white--text"
                @click="removeFile(item)"
              >
                <v-icon>
                  delete
                </v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
      </v-flex>
      <v-flex
        xs12
        pa-2
      >
        <v-btn
          :disabled="files.length === 0"
          class="primary--text"
          @click="sendFiles()"
        >
          Enviar arquivos
          <v-icon
            right
          >
            send
          </v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    ticketData: {
      type: Object,
      default: () => {
        return {
          files: []
        }
      }
    }
  },
  data() {
    return {
      fileHeaders: [
        {
          text: 'Preview',
          value: 'preview'
        },
        {
          text: 'Nome',
          value: 'name'
        },
        {
          text: 'Anexado',
          value: 'old'
        },
        {
          text: 'Tipo',
          value: 'type'
        },
        {
          text: 'Remover',
          value: 'remove'
        }
      ]
    }
  },
  computed: mapGetters({
    files: 'file/getFiles',
    filePreview: 'file/getFilePreview',
    dialog: 'ticket/getDialog'
  }),
  watch: {
    dialog: function(value) {
      this.updateFiles()
    }
  },
  mounted() {
    this.updateFiles()
  },
  methods: {
    updateFiles() {
      if (this.ticketData.files === undefined) return
      this.$store.commit(
        'file/setFilePreview',
        this.ticketData.files.map(f => {
          return {
            ...f,
            old: true
          }
        })
      )
    },
    selectFile() {
      const files = this.$refs.filePicker.files
      this.$store.commit('file/setFiles', files)
      const vue = this
      for (let file in Object.keys(files)) {
        file = files[file]
        const fileReader = new FileReader()
        const type = file.type
        const preview = {
          type: type,
          name: file.name
        }
        fileReader.onloadend = function() {
          vue.$store.commit('file/addFilePreview', {
            data: fileReader.result,
            ...preview
          })
        }
        const types = ['image', 'audio']
        const find = types.findIndex(t => {
          return type.includes(t)
        })
        if (find !== -1) {
          fileReader.readAsDataURL(file)
        } else {
          vue.$store.commit('file/addFilePreview', preview)
        }
      }
    },
    removeFile(file) {
      if (file.old) {
        this.removeFileInServer(file)
      }
      const files = Object.values(this.files).filter(v => {
        if (v.name !== file.name) {
          return v
        }
      })
      const filePreview = this.filePreview.filter(f => {
        return f.name !== file.name
      })
      this.$store.commit('file/setFilePreview', filePreview)
      this.$store.commit('file/setFiles', files)
    },
    activateFile() {
      this.$refs.filePicker.click()
    },
    sendFiles() {
      const formData = new FormData()
      const files = Object.values(this.files).filter(v => {
        if (!v.old) {
          return v
        }
      })
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        formData.append(`files[${i}]`, file)
      }

      this.$axios
        .post(`api/ticket/${this.ticketData._id}/file`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(response => {
          this.$toast.show('Enviado com sucesso', {
            duration: 1000
          })
          this.$store.commit('file/setFiles', response.data)
        })
    },
    removeFileInServer(file) {
      this.$axios
        .delete(`api/ticket/${this.ticketData._id}/${file.name}/file`)
        .then(() => {
          const files = this.ticketData.files.filter(f => {
            return f.name !== file.name
          })
          this.$store.commit('file/setFiles', files)
        })
    }
  }
}
</script>
<style>
</style>
