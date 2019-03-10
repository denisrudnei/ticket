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
            <nuxt-link
              :to="`/analyst/${ticket.actualUser._id}`"
              target="_blank"
            >
              <v-select
                v-model="ticket.actualUser"
                :rules="[v => !!v || 'Necessário preencher']"
                :items="analysts.map(v => { return {text: v.name, value: v} })"
                required
                box
                label="Analista"
                disabled
              />
            </nuxt-link>
          </v-flex>
          <v-flex
            xs12
            md6
            pa-1
          >
            <v-select
              v-model="ticket.category"
              :items="categories.map(c => { return { text: c.fullName, value: c } })"
              :rules="[v => !!v || 'Necessário preencher uma categoria']"
              required
              box
              label="Categoria"
              disabled
            />
          </v-flex>
          <v-flex
            xs12
            md6
            pa-1
          >
            <v-select
              v-model="ticket.group"
              :items="groups.map(g => { return { text: g.name, value: g } })"
              :rules="[v => !!v || 'Necessário preeencher o grupo']"
              required
              box
              disabled
              label="Grupo"
            />
          </v-flex>
          <v-flex
            xs12
            md6
            pa-1
          >
            <v-select
              v-model="ticket.status"
              :items="status.map(s => { return { text: s.name, value: s } })"
              :rules="[v => !!v || 'Necessário preencher status']"
              required
              box
              disabled
              label="Status"
            />
          </v-flex>
          <v-flex
            xs12
            pa-1
          >
            <v-text-field
              v-model="ticket.resume"
              :rules="[v => !!v || 'Necessário preencher o resumo']"
              required
              box
              disabled
              label="Resumo"
            />
          </v-flex>
          <v-flex
            xs12
            pa-1
          >
            <v-textarea
              v-model="ticket.content"
              :rules="[v => !!v || 'Necessário preeencher o corpo deo chamado']"
              required
              box
              disabled
              label="Conteúdo"
            />
          </v-flex>
          <v-flex
            xs12
          >
            <v-btn @click="save()">
              Salvar
              <v-icon righ>
                save
              </v-icon>
            </v-btn>
          </v-flex>
          <v-flex
            xs12
          >
            <v-tabs>
              <v-tab>
                Logs
              </v-tab>
              <v-tab-item>
                <!--<v-data-table
                  :items="ticket.logs"
                  :headers="headers">
                  <template
                    slot="items"
                    slot-scope="data">
                    <td>{{ data.item.actualUser.name }}</td>
                    <td>{{ data.item.date }}</td>
                    <td>{{ data.item.oldStatus.name }}</td>
                    <td>{{ data.item.group.name }}</td>
                  </template>
                </v-data-table>-->
              </v-tab-item>
              <v-tab>
                Arquivos
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
      ]
    }
  },
  asyncData() {
    return {
      analysts: [],
      groups: [],
      status: [],
      categories: [],
      ticket: {
        actualUser: {
          _id: ''
        }
      }
    }
  },
  created() {
    this.update()
  },
  methods: {
    save() {
      const id = this.$router.currentRoute.params.id
      if (this.$refs.form.validate()) {
        this.$axios.put(`api/ticket/${id}`, this.ticket).then(() => {
          this.update()
        })
      }
    },
    update() {
      const id = this.$router.currentRoute.params.id
      this.$axios.get(`api/ticket/${id}`).then(result => {
        this.ticket = result.data
      })
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
    }
  }
}
</script>

<style>
</style>
