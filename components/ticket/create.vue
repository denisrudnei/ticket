<template>
  <v-layout>
    <v-flex
      xs12
      pa-2
    >
      <v-menu
        v-if="readOnlyData"
        offset-y
        :close-on-content-click="false"
        :nudge-width="500"
        max-height="45vw"
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
                  v-model="comment"
                  box
                  label="Comentário"
                />
                <v-btn
                  icon
                  class="primary white--text"
                  @click="addComment()"
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
                <file-include
                  :ticket-data="ticketData"
                />
              </v-tab-item>
              <v-tab>
                Transferir
                <v-icon>
                  send
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
                    <v-autocomplete
                      box
                      :items="groups.map(g =>({ text: g.name, value: g }))"
                      label="Grupo"
                    />
                  </v-flex>
                  <v-flex
                    xs12
                    pa-2
                  >
                    <v-btn
                      class="primary white--text"
                      icon
                    >
                      <v-icon>
                        send
                      </v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-tab-item>
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
              :rules="!search ? [v => !!v || 'Necessário preencher'] : undefined"
              :items="analysts.map(a => { return {text: a.name, value: a} })"
              required
              :readonly="readOnlyData || !search"
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
              :rules="!search ? [v => !!v || 'Necessário preencher']: undefined"
              :items="analysts.map(u => { return {text: u.name, value: u} })"
              required
              :readonly="readOnlyData"
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
              :rules="!search ? [v => !!v || 'Necessário preencher uma categoria'] : undefined"
              required
              :readonly="readOnlyData"
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
              :rules="!search ? [v => !!v || 'Necessário preeencher o grupo'] : undefined"
              required
              :readonly="readOnlyData"
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
              :rules="!search ? [v => !!v || 'Necessário preencher status'] : undefined"
              required
              :readonly="readOnlyData"
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
                pa-2
              >
                <h3 v-if="!search">
                  Criado em: {{ ticketComputed.created | date }}
                </h3>
                <v-menu
                  v-if="search"
                  v-model="menuDateInitial"
                  full-width
                  max-width="290"
                  :close-on-content-click="false"
                >
                  <template
                    v-slot:activator="{ on }"
                  >
                    <v-text-field
                      :value="initial | date"
                      box
                      label="Data em que foi aberto"
                      readonly
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="initial"
                  />
                </v-menu>
              </v-flex>
              <v-flex
                xs6
                pa-2
              >
                <h3 v-if="!search">
                  Última modificação: {{ ticketComputed.modified | date }}
                </h3>
                <v-menu
                  v-if="search"
                  v-model="menuDateFinal"
                  full-width
                  max-width="290"
                  :close-on-content-click="false"
                >
                  <template
                    v-slot:activator="{ on }"
                  >
                    <v-text-field
                      :value="final | date"
                      box
                      label="Data limite"
                      readonly
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="final"
                  />
                </v-menu>
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
              :readonly="readOnlyData"
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
              :readonly="readOnlyData"
              box
              label="Conteúdo"
            />
          </v-flex>
          <v-flex
            xs12
          >
            <v-btn
              v-if="!readOnlyData"
              class="primary"
              @click="save()"
            >
              {{ !search ? 'Salvar' : 'Pesquisar' }}
              <v-icon right>
                save
              </v-icon>
            </v-btn>
            <v-btn
              v-if="search"
              class="primary"
              @click="clearFields()"
            >
              Limpar campos
            </v-btn>
            <v-btn
              v-if="readOnlyData"
              class="primary white--text"
              @click="edit()"
            >
              Editar
            </v-btn>
            <v-btn
              v-if="editing"
              class="primary white--text"
              @click="cancelEdit()"
            >
              Cancelar edição
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
                <Logs />
              </v-tab-item>
              <v-tab>
                Arquivos
                <v-icon>
                  attach_file
                </v-icon>
              </v-tab>
              <v-tab-item>
                <file-include />
              </v-tab-item>
              <v-tab>
                Comentários
                <v-icon>
                  comment
                </v-icon>
              </v-tab>
              <v-tab-item>
                <Comments />
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
import FileInclude from '@/components/files/include'
import Logs from '@/components/ticket/logs'
import Comments from '@/components/ticket/comments'

export default {
  components: {
    FileInclude,
    Logs,
    Comments
  },
  filters: {
    date(value) {
      const newDate = new Date(value)
      return newDate.toLocaleDateString()
    }
  },
  props: {
    search: Boolean,
    readonly: {
      type: Boolean,
      default: false
    },
    ticket: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      editing: false,
      menuDateInitial: false,
      menuDateFinal: false,
      readOnlyData: false,
      analysts: [],
      groups: [],
      status: [],
      categories: [],
      initial: new Date().toISOString().substr(0, 10),
      final: new Date().toISOString().substr(0, 10),
      comment: '',
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
  created() {
    this.readOnlyData = this.readonly
    this.$axios.get('/analyst').then(result => {
      this.analysts = result.data
    })
    this.$axios.get('/group').then(result => {
      this.groups = result.data
    })
    this.$axios.get('status').then(result => {
      this.status = result.data
    })
    this.$axios.get('/category').then(result => {
      this.categories = result.data
    })
    if (!this.search && !this.readonly) {
      const openedBy = this.analysts.filter(a => {
        return a._id === this.user._id
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
    addComment() {
      this.$axios
        .post(`/ticket/comment/${this.ticketComputed._id}`, {
          content: this.comment
        })
        .then(() => {
          this.comment = ''
        })
    },
    save() {
      if (!this.search && this.$refs.form.validate()) {
        this.$emit('input', this.ticketComputed)
        this.readOnlyData = true
        this.editing = false
      } else {
        this.$emit('input', this.ticketComputed)
      }
    },
    edit() {
      this.readOnlyData = false
      this.editing = true
    },
    cancelEdit() {
      this.editing = false
      this.readOnlyData = true
      this.$axios.get(`/ticket/${this.ticketData._id}`).then(response => {
        this.ticketData = response.data
      })
    },
    clearFields() {
      Object.keys(this.ticketData).forEach(key => {
        this.ticketData[key] = undefined
        delete this.ticketData[key]
      })
    }
  }
}
</script>
