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
              v-model="ticket.actualUser"
              :rules="[v => !!v || 'Necessário preencher']"
              :items="analysts.map(v => { return {text: v.name, value: v} })"
              required
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
              v-model="ticket.category"
              :items="categories.map(c => { return { text: c.fullName, value: c } })"
              :rules="[v => !!v || 'Necessário preencher uma categoria']"
              required
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
              v-model="ticket.group"
              :items="groups.map(g => { return { text: g.name, value: g } })"
              :rules="[v => !!v || 'Necessário preeencher o grupo']"
              required
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
              v-model="ticket.status"
              :items="status.map(s => { return { text: s.name, value: s } })"
              :rules="[v => !!v || 'Necessário preencher status']"
              required
              box
              label="Status"
            />
          </v-flex>
          <v-flex
            v-show="!search"
            xs12
            pa-1
          >
            <v-text-field
              v-model="ticket.resume"
              :rules="[v => !!v || 'Necessário preencher o resumo']"
              required
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
              v-model="ticket.content"
              :rules="[v => !!v || 'Necessário preeencher o corpo deo chamado']"
              required
              box
              label="Conteúdo"
            />
          </v-flex>
          <v-flex
            xs12
          >
            <v-btn
              @click="save()"
              class="primary"
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
                  :items="ticket.logs"
                  :headers="headers"
                >
                  <template
                    slot="items"
                    slot-scope="data"
                  >
                    <td>{{ data.item.user }}</td>
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
                    Teste
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
    search: Boolean
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
      ticket: {
        resume: '',
        content: ''
      }
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
  computed: {
    value() {
      return this.ticket
    }
  },
  methods: {
    save() {
      this.$emit('input', this.ticket)
      /* if (this.$refs.form.validate()) {
        this.$axios.post('api/ticket', this.ticket).then(() => {
          this.$router.push('/ticket')
        })
      } */
    }
  }
}
</script>
