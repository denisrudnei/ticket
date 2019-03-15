<template>
  <v-layout>
    <v-flex
      xs12
      pa-2
    >
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
            md6
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
            md6
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
            md6
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
            md6
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
                <h3>Criado em: {{ ticketComputed.created | date }}</h3>
              </v-flex>
              <v-flex
                xs6
              >
                <h3>Última modificação: {{ ticketComputed.modified | date }}</h3>
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
                <v-data-table
                  :items="ticketComputed.logs"
                  :headers="headers"
                >
                  <template
                    slot="items"
                    slot-scope="data"
                  >
                    <td>{{ data.item.user.name }}</td>
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
                  <v-list-tile>
                  </v-list-tile>
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
export default {
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
  filters: {
    date(value) {
      const newDate = new Date(value)
      return newDate.toLocaleString()
      // return `${newDate.getDate()}/${newDate.getMonth()}/${newDate.getFullYear()} ${newDate.getHours()}`
    }
  },
  data() {
    return {
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
          value: 'status'
        },
        {
          text: 'Grupo',
          value: 'group'
        }
      ],
      analysts: [],
      groups: [],
      status: [],
      categories: [],
      ticketData: {
        resume: '',
        content: ''
      }
    }
  },
  computed: {
    value() {
      return this.ticketData
    },
    ticketComputed() {
      return Object.assign(this.ticketData, this.ticket)
    }
  },
  created() {
    this.$axios.get('api/analyst').then(result => {
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
  },
  methods: {
    save() {
      this.$emit('input', this.ticketComputed)
      /* if (this.$refs.form.validate()) {
        this.$axios.post('api/ticket', this.ticket).then(() => {
          this.$router.push('/ticket')
        })
      } */
    }
  }
}
</script>
