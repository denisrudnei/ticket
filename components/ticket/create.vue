<template>
  <v-layout>
    <v-flex
      xs12
      pa-2
    >
      <v-menu
        offset-y
        :close-on-content-click="false"
        :nudge-width="350"
      >
        <template
          v-slot:activator="{ on }"
        >
          <v-btn
            class="primary white--text"
            v-on="on"
          >
            Ações
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <v-tabs
              icons-and-text
            >
              <v-tab>
                Adicionar comentário
                <v-icon>
                  chat
                </v-icon>
              </v-tab>
              <v-tab-item>
                <v-textarea
                  box
                  label="Comentário"
                />
                <v-btn
                  icon
                  class="primary white--text"
                >
                  <v-icon>
                    send
                  </v-icon>
                </v-btn>
              </v-tab-item>
              <v-tab>
                Incluir arquivo
                <v-icon>
                  attach_file
                </v-icon>
              </v-tab>
              <v-tab-item>
                <input ref="filePicker" type="file" @change="selectFile()">
                <v-layout
                  row
                  wrap
                >
                  <v-flex
                    v-for="file in files"
                    :key="file.name"
                    xs12
                    md6
                    pa-3
                  >
                    <v-img :src="file.data" />
                  </v-flex>
                  <v-flex
                    xs12
                    pa-2
                  >
                    <v-btn
                      icon
                      class="primary white-text"
                    >
                      <v-icon>
                        send
                      </v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-tab-item>
              <v-tab>
                Transferir
                <v-icon>
                  send
                </v-icon>
              </v-tab>
              <v-tab-item />
            </v-tabs>
          </v-card-text>
        </v-card>
      </v-menu>
      <v-form
        ref="form"
        lazy-validation
      >
        <v-layout
          row
          wrap
          align-center
        >
          <v-flex
            xs12
            md4
            pa-1
          >
            <v-autocomplete
              v-model="ticketComputed.openedBy"
              :rules="[v => !!v || 'Necessário preencher']"
              :items="analysts.map(v => { return {text: v.name, value: v} })"
              required
              :readonly="readonly || !search"
              box
              label="Relatado por:"
            />
          </v-flex>
          <v-flex
            xs12
            md4
            pa-1
          >
            <v-autocomplete
              v-model="ticketComputed.actualUser"
              :rules="[v => !!v || 'Necessário preencher']"
              :items="analysts.map(v => { return {text: v.name, value: v} })"
              required
              :readonly="readonly"
              box
              label="Analista"
            />
          </v-flex>
          <v-flex
            xs12
            md4
            pa-1
          >
            <v-autocomplete
              v-model="ticketComputed.category"
              :items="categories.filter(c => { return c.subs.length === 0 }).map(c => { return { text: c.fullName, value: c } })"
              :rules="[v => !!v || 'Necessário preencher uma categoria']"
              required
              :readonly="readonly"
              box
              label="Categoria"
            />
          </v-flex>
          <v-flex
            xs12
            md4
            pa-1
          >
            <v-autocomplete
              v-model="ticketComputed.group"
              :items="groups.map(g => { return { text: g.name, value: g } })"
              :rules="[v => !!v || 'Necessário preeencher o grupo']"
              required
              :readonly="readonly"
              box
              label="Grupo"
            />
          </v-flex>
          <v-flex
            xs12
            md4
            pa-1
          >
            <v-autocomplete
              v-model="ticketComputed.status"
              :items="status.map(s => { return { text: s.name, value: s } })"
              :rules="[v => !!v || 'Necessário preencher status']"
              required
              :readonly="readonly"
              box
              label="Status"
            />
          </v-flex>
          <v-flex
            xs12
            pa-2
          >
            <v-layout
              row
              wrap
            >
              <v-flex
                xs6
              >
                <h3 v-if="!search">
                  Criado em: {{ ticketComputed.created | date }}
                </h3>
                <v-menu
                  v-if="search"
                  v-model="menuDateCreated"
                  full-width
                  max-width="290"
                >
                  <template
                    v-slot:activator="{ on }"
                  >
                    <v-text-field
                      :value="momentValue()"
                      box
                      label="Data em que foi aberto"
                      readonly
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="created"
                  />
                </v-menu>
              </v-flex>
              <v-flex
                xs6
              >
                <h3 v-if="!search">
                  Última modificação: {{ ticketComputed.modified | date }}
                </h3>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex
            v-show="!search"
            xs12
            pa-1
          >
            <v-text-field
              v-model="ticketComputed.resume"
              :rules="[v => !!v || 'Necessário preencher o resumo']"
              required
              :readonly="readonly"
              box
              label="Resumo"
            />
          </v-flex>
          <v-flex
            v-show="!search"
            xs12
            pa-1
          >
            <v-textarea
              v-model="ticketComputed.content"
              :rules="[v => !!v || 'Necessário preeencher o corpo deo chamado']"
              required
              :readonly="readonly"
              box
              label="Conteúdo"
            />
          </v-flex>
          <v-flex
            xs12
          >
            <v-btn
              class="primary"
              @click="save()"
            >
              {{ !search ? 'Salvar' : 'Pesquisar' }}
              <v-icon right>
                save
              </v-icon>
            </v-btn>
          </v-flex>
          <v-flex
            v-show="!search"
            xs12
          >
            <v-tabs
              icons-and-text
            >
              <v-tab>
                Logs
                <v-icon>
                  history
                </v-icon>
              </v-tab>
              <v-tab-item>
                <v-layout
                  row
                  wrap
                >
                  <v-flex
                    xs12
                    pa-2
                  >
                    <v-timeline
                      align-top
                    >
                      <v-timeline-item
                        v-for="(log, index) in ticketComputed.logs"
                        :key="index"
                        :left="index%2===0"
                        :right="index%2!==0"
                        small
                      >
                        <template
                          v-slot:opposite
                        >
                          <span>{{ log.oldStatus.name }}</span>
                        </template>
                        <v-card>
                          <v-card-title
                            class="headline"
                          >
                            {{ log.group.name }}
                          </v-card-title>
                          <v-card-text>
                            {{ log.oldStatus.name }}
                            <hr>
                            Atualizado por: {{ log.user.name }} em {{ log.date | date }}
                          </v-card-text>
                        </v-card>
                      </v-timeline-item>
                    </v-timeline>
                  </v-flex>
                </v-layout>
                <v-data-table
                  :items="ticketComputed.logs"
                  :headers="headers"
                >
                  <template
                    slot="items"
                    slot-scope="data"
                  >
                    <td>{{ data.item.user.name }}</td>
                    <td>{{ data.item.date | date }}</td>
                    <td>{{ data.item.oldStatus.name }}</td>
                    <td>{{ data.item.group.name }}</td>
                  </template>
                </v-data-table>
              </v-tab-item>
              <v-tab>
                Arquivos
                <v-icon>
                  attach_file
                </v-icon>
              </v-tab>
              <v-tab-item>
                <v-btn>
                  Incluir arquivo
                  <v-icon>
                    attach_file
                  </v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile />
                </v-list>
              </v-tab-item>
            </v-tabs>
          </v-flex>
        </v-layout>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
// import { format } from 'date-fns/format'

export default {
  filters: {
    date(value) {
      const newDate = new Date(value)
      return newDate.toLocaleString()
    }
  },
  props: {
    search: Boolean,
    readonly: Boolean,
    ticket: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      menuDateCreated: false,
      files: [],
      headers: [
        {
          text: 'Usuário',
          value: 'user'
        },
        {
          text: 'Data',
          value: 'date'
        },
        {
          text: 'Status',
          value: 'status.name'
        },
        {
          text: 'Grupo',
          value: 'group.name'
        }
      ],
      analysts: [],
      groups: [],
      status: [],
      categories: [],
      created: new Date().toISOString().substr(0, 10),
      ticketData: {
        resume: '',
        content: '',
        created: new Date(),
        modified: new Date()
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/getUser'
    }),
    value() {
      return this.ticketData
    },
    ticketComputed() {
      return Object.assign(this.ticketData, this.ticket)
    }
  },
  async created() {
    await this.$axios.get('api/analyst').then(result => {
      this.analysts = result.data
    })
    this.$axios.get('api/group').then(result => {
      this.groups = result.data
    })
    this.$axios.get('api/status').then(result => {
      this.status = result.data
    })
    this.$axios.get('api/category').then(result => {
      this.categories = result.data
    })
    if (!this.search && !this.readonly) {
      const openedBy = this.analysts.filter(a => {
        return a.email === this.user.email
      })[0]
      this.ticketComputed.openedBy = openedBy
    }
  },
  methods: {
    momentValue() {
      return this.ticketComputed.created
        ? moment(this.ticketComputed.created).format('dddd, MMMM Do YYYY')
        : ''
    },
    save() {
      if (!this.search && this.$refs.form.validate()) {
        this.$emit('input', this.ticketComputed)
      } else {
        this.$emit('input', this.ticketComputed)
      }
    },
    selectFile() {
      const vue = this
      const fileReader = new FileReader()
      fileReader.onloadend = function() {
        vue.files.push({
          data: fileReader.result
        })
      }

      fileReader.readAsDataURL(this.$refs.filePicker.files[0])
    }
  }
}
</script>
