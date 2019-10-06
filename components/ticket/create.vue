<template>
  <v-row>
    <v-col
      cols="12"
      pa-3
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
            tile
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
                  filled
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
                <v-row>
                  <v-col
                    cols="12"
                    pa-3
                  >
                    <v-autocomplete
                      filled
                      :items="groups.map(g =>({ text: g.name, value: g }))"
                      label="Grupo"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    pa-3
                  >
                    <v-btn
                      class="primary white--text"
                      icon
                    >
                      <v-icon>
                        send
                      </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
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
        <v-row
          align="center"
        >
          <v-col
            cols="12"
            md="4"
            pa-1
          >
            <v-autocomplete
              v-model="ticketComputed.openedBy"
              :rules="!search ? [v => !!v || 'Necessário preencher'] : undefined"
              :items="analysts.map(a => { return {text: a.name, value: a} })"
              required
              :readonly="readOnlyData || !search"
              filled
              :value-comparator="compare"
              :clearable="search"
              label="Relatado por:"
              append-icon="search"
              @click:append="show('openedBy', ticketComputed.openedBy)"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            pa-1
          >
            <v-autocomplete
              v-model="ticketComputed.affectedUser"
              :rules="!search ? [v => !!v || 'Necessário preencher']: undefined"
              :items="analysts.map(u => { return {text: u.name, value: u} })"
              required
              :readonly="readOnlyData"
              filled
              label="Usuário final afetado"
              :clearable="search || editing || !readonly"
              :value-comparator="compare"
              append-icon="search"
              @click:append="show('affectedUser', ticketComputed.affectedUser)"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            pa-1
          >
            <v-autocomplete
              v-model="ticketComputed.actualUser"
              :rules="!search ? [v => !!v || 'Necessário preencher']: undefined"
              :items="analysts.map(u => { return {text: u.name, value: u} })"
              required
              :readonly="readOnlyData"
              filled
              label="Analista"
              :clearable="search || editing || !readonly"
              :value-comparator="compare"
              append-icon="search"
              @click:append="show('actualUser', ticketComputed.actualUser)"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            pa-1
          >
            <v-autocomplete
              v-model="ticketComputed.category"
              :items="categories.filter(c => { return c.subs.length === 0 }).map(c => { return { text: c.fullName, value: c } })"
              :rules="!search ? [v => !!v || 'Necessário preencher uma categoria'] : undefined"
              required
              :readonly="readOnlyData"
              filled
              :clearable="search || editing || !readonly"
              :value-comparator="compare"
              label="Categoria"
              append-icon="search"
              @change="changeCategory"
              @click:append="show('category', ticketComputed.category)"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            pa-1
          >
            <v-autocomplete
              v-model="ticketComputed.group"
              :items="groups.map(g => { return { text: g.name, value: g } })"
              :rules="!search ? [v => !!v || 'Necessário preeencher o grupo'] : undefined"
              required
              :readonly="readOnlyData"
              filled
              :clearable="search || editing || !readonly"
              :value-comparator="compare"
              label="Grupo"
              append-icon="search"
              @click:append="show('group', ticketComputed.group)"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            pa-1
          >
            <v-autocomplete
              v-model="ticketComputed.status"
              :items="allowedStatus.map(s => { return { text: s.name, value: s } })"
              :rules="!search ? [v => !!v || 'Necessário preencher status'] : undefined"
              required
              :readonly="readOnlyData"
              filled
              :clearable="search || editing || !readonly"
              :value-comparator="compare"
              label="Status"
              append-icon="search"
              @click:append="show('status', ticketComputed.status)"
            />
          </v-col>
          <v-col
            cols="12"
            pa-3
          >
            <v-row>
              <v-col
                cols="6"
                pa-3
              >
                <h3 v-if="!search">
                  Criado em: {{ ticketComputed.created | date }}
                </h3>
                <v-menu
                  v-if="search"
                  v-model="menuDateInitial"
                  max-width="290"
                  :close-on-content-click="false"
                >
                  <template
                    v-slot:activator="{ on }"
                  >
                    <v-text-field
                      :value="initial | date"
                      filled
                      label="Data em que foi aberto"
                      readonly
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="initial"
                  />
                </v-menu>
              </v-col>
              <v-col
                cols="6"
                pa-3
              >
                <h3 v-if="!search">
                  Última modificação: {{ ticketComputed.modified | date }}
                </h3>
                <v-menu
                  v-if="search"
                  v-model="menuDateFinal"
                  max-width="290"
                  :close-on-content-click="false"
                >
                  <template
                    v-slot:activator="{ on }"
                  >
                    <v-text-field
                      :value="final | date"
                      filled
                      label="Data limite"
                      readonly
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="final"
                  />
                </v-menu>
              </v-col>
            </v-row>
          </v-col>
          <v-col
            v-show="!search"
            cols="12"
            pa-1
          >
            <v-text-field
              v-model="ticketComputed.resume"
              :rules="[v => !!v || 'Necessário preencher o resumo']"
              required
              :readonly="readOnlyData"
              filled
              label="Resumo"
            />
          </v-col>
          <v-col
            v-show="!search"
            cols="12"
            pa-1
          >
            <v-textarea
              v-model="ticketComputed.content"
              :rules="[v => !!v || 'Necessário preeencher o corpo deo chamado']"
              required
              :readonly="readOnlyData"
              filled
              label="Conteúdo"
            />
          </v-col>
          <v-col
            cols="12"
          >
            <v-btn
              v-if="!readOnlyData"
              class="primary"
              tile
              @click="save()"
            >
              {{ !search ? 'Salvar' : 'Pesquisar' }}
              <v-icon right>
                save
              </v-icon>
            </v-btn>
            <v-btn
              v-if="search"
              tile
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
              tile
              class="primary white--text"
              @click="cancelEdit()"
            >
              Cancelar edição
            </v-btn>
          </v-col>
          <v-col
            v-show="!search"
            cols="12"
          >
            <v-tabs
              icons-and-text
              show-arrows
            >
              <v-tab>
                Campos
                <v-icon>build</v-icon>
              </v-tab>
              <v-tab-item>
                <Fields v-model="ticketComputed" :edit="!readOnlyData" />
              </v-tab-item>
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
                <comments />
              </v-tab-item>
            </v-tabs>
          </v-col>
        </v-row>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import ggl from 'graphql-tag'
import Fields from '@/components/ticket/fields'
import FileInclude from '@/components/files/include'
import Logs from '@/components/ticket/logs'
import Comments from '@/components/ticket/comments'
import compareObjectsWithId from '@/mixins/compareObjectsWithId'
import showModal from '@/mixins/showModal'
import create from '@/graphql/query/ticket/create.graphql'
export default {
  components: {
    Fields,
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
  mixins: [compareObjectsWithId, showModal],
  props: {
    search: Boolean,
    readonly: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: () => {
        return {
          group: {},
          category: {}
        }
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
        comments: [],
        group: {},
        category: {},
        created: new Date(),
        modified: new Date()
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/getUser'
    }),
    ticketComputed() {
      return Object.assign(this.ticketData, this.value)
    },
    allowedStatus() {
      if (this.search) return this.status
      if (!this.ticketComputed.status) return this.status
      if (!this.editing) return this.status
      const statusIndex = this.status.findIndex(s => {
        return s._id === this.ticketComputed.status._id
      })

      const result = [this.ticketComputed.status]
      if (statusIndex !== -1) {
        result.push(...this.status[statusIndex].allowedStatus)
      }
      return result
    }
  },
  created() {
    this.readOnlyData = this.readonly
    this.$apollo
      .query({
        query: ggl(create)
      })
      .then(response => {
        this.analysts = response.data.Analyst
        if (!this.search && !this.readonly) {
          const openedBy = this.analysts.filter(a => {
            return a._id === this.user._id
          })[0]
          this.ticketComputed.openedBy = openedBy
        }
        this.groups = response.data.Group
        this.status = response.data.Status
        this.categories = response.data.Category
      })
  },
  methods: {
    addComment() {
      const comment = {
        content: this.comment
      }
      this.$axios
        .post(`/ticket/comment/${this.ticketComputed._id}`, comment)
        .then(response => {
          this.comment = ''
          this.$store.commit('ticket/addComment', response.data)
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
    changeCategory() {
      if (this.search) return
      if (!this.ticketComputed.category) return
      this.checkFields()
      this.changeDefaultGroup()
    },
    changeDefaultGroup() {
      if (!this.ticketComputed.category.defaultGroup) return
      const index = this.groups.findIndex(g => {
        return g._id === this.ticketComputed.category.defaultGroup._id
      })
      if (
        this.ticketComputed.group === undefined ||
        (Object.prototype.hasOwnProperty.call(this.ticketComputed, 'group') &&
          !Object.prototype.hasOwnProperty.call(
            this.ticketComputed.group,
            '_id'
          ))
      ) {
        this.ticketComputed.group = this.groups[index]
      }
    },
    checkFields() {
      if (
        !Object.prototype.hasOwnProperty.call(
          this.ticketComputed.category,
          'fields'
        )
      )
        return
      this.ticketComputed.fields = this.ticketComputed.category.fields
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
