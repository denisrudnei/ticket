<template>
  <v-row v-hotkey="keymap">
    <v-col
      cols="12"
      pa-3
    >
      <v-menu
        v-if="readOnlyData"
        v-model="action.active"
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
            {{ $t('actions') }}
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <v-tabs
              icons-and-text
            >
              <v-tab>
                {{ $t('add_comment') }}
                <v-icon>
                  chat
                </v-icon>
              </v-tab>
              <v-tab-item>
                <v-textarea
                  v-model="comment"
                  filled
                  :label="$t('comment')"
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
                {{ $t('add_file') }}
                <v-icon>
                  attach_file
                </v-icon>
              </v-tab>
              <v-tab-item>
                <file-include
                  :ticket-data="ticket"
                />
              </v-tab-item>
              <v-tab>
                {{ $t('transfer') }}
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
                      :label="$t('group')"
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
            v-if="!search"
            cols="12"
            md="1"
            pa-1
          >
            <v-text-field
              :value="ticket.ticketNumber"
              disabled
              filled
              :label="$t('ticket_number')"
            />
          </v-col>
          <v-col
            cols="12"
            :md="!search ? 3 : 4"
            pa-1
          >
            <v-autocomplete
              :value="ticket.openedBy"
              :rules="!search ? [v => !!v || 'Necessário preencher'] : undefined"
              :items="analysts.map(a => { return {text: a.name, value: a} })"
              required
              :readonly="readOnlyData || !search"
              filled
              :value-comparator="compare"
              :clearable="search"
              :label="$t('opened_by')"
              append-icon="search"
              @click:append="show('openedBy', ticket.openedBy)"
              @change="setFieldInActualTicket($event, 'openedBy')"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            pa-1
          >
            <v-autocomplete
              :value="ticket.affectedUser"
              :rules="!search ? [v => !!v || 'Necessário preencher']: undefined"
              :items="analysts.map(u => { return {text: u.name, value: u} })"
              required
              :readonly="readOnlyData"
              filled
              :label="$t('affected_user')"
              :clearable="search || editing || !readonly"
              :value-comparator="compare"
              append-icon="search"
              @change="setFieldInActualTicket($event, 'affectedUser')"
              @click:append="show('affectedUser', ticket.affectedUser)"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            pa-1
          >
            <v-autocomplete
              :value="ticket.actualUser"
              :rules="!search ? [v => !!v || 'Necessário preencher']: undefined"
              :items="analysts.map(u => { return {text: u.name, value: u} })"
              required
              :readonly="readOnlyData"
              filled
              :label="$t('analyst')"
              :clearable="search || editing || !readonly"
              :value-comparator="compare"
              append-icon="search"
              @click:append="show('actualUser', ticket.actualUser)"
              @change="setFieldInActualTicket($event, 'actualUser')"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            pa-1
          >
            <v-autocomplete
              :value="ticket.category"
              :items="categories.filter(c => { return c.subs.length === 0 }).map(c => { return { text: c.fullName, value: c } })"
              :rules="!search ? [v => !!v || 'Necessário preencher uma categoria'] : undefined"
              required
              :readonly="readOnlyData"
              filled
              :clearable="search || editing || !readonly"
              :value-comparator="compare"
              :label="$t('category')"
              append-icon="search"
              @change="changeCategory($event)"
              @click:append="show('category', ticket.category)"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            pa-1
          >
            <v-autocomplete
              :value="ticket.group"
              :items="groups.map(g => { return { text: g.name, value: g } })"
              :rules="!search ? [v => !!v || 'Necessário preeencher o grupo'] : undefined"
              required
              :readonly="readOnlyData"
              filled
              :clearable="search || editing || !readonly"
              :value-comparator="compare"
              :label="$t('group')"
              append-icon="search"
              @change="setFieldInActualTicket($event, 'group')"
              @click:append="show('group', ticket.group)"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            pa-1
          >
            <v-autocomplete
              :value="ticket.status"
              :items="allowedStatus.map(s => { return { text: s.name, value: s } })"
              :rules="!search ? [v => !!v || 'Necessário preencher status'] : undefined"
              required
              :readonly="readOnlyData"
              filled
              :clearable="search || editing || !readonly"
              :value-comparator="compare"
              :label="$t('status')"
              append-icon="search"
              @click:append="show('status', ticket.status)"
              @change="setFieldInActualTicket($event, 'status')"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            pa-1
          >
            <v-select
              :value="ticket.priority"
              :items="priorities.map(p => { return { text: `${p.weight} - ${p.name}`, value: p } })"
              :rules="!search ? [v => !!v || 'Prioridade requirida'] : undefined"
              required
              :readonly="readOnlyData"
              filled
              :clearable="search || editing || !readonly"
              :value-comparator="compare"
              :label="$t('priority')"
              append-icon="search"
              @click:append="show('priority', ticket.priority)"
              @change="setFieldInActualTicket($event, 'priority')"
            />
          </v-col>
          <v-col v-if="!search && ticket.slaCount" cols="12" class="pa-2">
            <h3>{{ $t('sla_update') }}: {{ ticket.slaCount | datetime }} | {{ ticket.slaPercentage | percentage }}</h3>
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
                <h3 v-if="!search && ticket.created">
                  {{ $t('creation_date') }}: {{ ticket.created | date }}
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
                      :label="$t('creation_date')"
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
                <h3 v-if="!search && ticket.modified">
                  {{ $t('modified_date') }}: {{ ticket.modified | datetime }}
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
              :value="ticket.resume"
              :rules="[v => !!v || 'Necessário preencher o resumo']"
              required
              :readonly="readOnlyData"
              filled
              :label="$t('resume')"
              @change="setFieldInActualTicket($event, 'resume')"
            />
          </v-col>
          <v-col
            v-show="!search"
            cols="12"
            pa-1
          >
            <v-textarea
              :value="ticket.content"
              :rules="[v => !!v || 'Necessário preeencher o corpo deo chamado']"
              required
              :readonly="readOnlyData"
              filled
              :label="$t('content')"
              @change="setFieldInActualTicket($event, 'content')"
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
              {{ !search ? $t('save') : $t('search') }}
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
              {{ $t('clear_fields') }}
            </v-btn>
            <v-btn
              v-if="readOnlyData"
              class="primary white--text"
              @click="edit()"
            >
              {{ $t('edit') }}
            </v-btn>
            <v-btn
              v-if="editing"
              tile
              class="primary white--text"
              @click="cancelEdit()"
            >
              {{ $t('cancel_edit') }}
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
                {{ $t('fields') }}
                <v-icon>build</v-icon>
              </v-tab>
              <v-tab-item>
                <Fields v-model="ticket" :edit="!readOnlyData" />
              </v-tab-item>
              <v-tab>
                {{ $t('logs') }}
                <v-icon>
                  history
                </v-icon>
              </v-tab>
              <v-tab-item>
                <Logs />
              </v-tab-item>
              <v-tab>
                {{ $t('files') }}
                <v-icon>
                  attach_file
                </v-icon>
              </v-tab>
              <v-tab-item>
                <file-include />
              </v-tab-item>
              <v-tab>
                {{ $t('comments') }}
                <v-icon>
                  comment
                </v-icon>
              </v-tab>
              <v-tab-item>
                <comments />
              </v-tab-item>
              <v-tab>
                {{ $t('children') }}
                <v-icon>
                  account_tree
                </v-icon>
              </v-tab>
              <v-tab-item>
                <children />
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
import Children from '@/components/ticket/children/index'
import compareObjectsWithId from '@/mixins/compareObjectsWithId'
import showModal from '@/mixins/showModal'
import create from '@/graphql/query/ticket/create.graphql'
export default {
  name: 'TicketCreate',
  components: {
    Fields,
    FileInclude,
    Logs,
    Comments,
    Children
  },
  filters: {
    date(value) {
      const newDate = new Date(value)
      return newDate.toLocaleDateString()
    },
    percentage(value) {
      return `${Math.round(value)} %`
    }
  },
  head() {
    return {
      title: `[${this.ticket.ticketNumber}] - [${this.ticketsToEdit.length}] ${
        this.ticket.resume
      }`
    }
  },
  mixins: [compareObjectsWithId, showModal],
  props: {
    search: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: () => {
        return {
          group: {},
          category: {},
          priority: {}
        }
      }
    }
  },
  data() {
    return {
      action: {
        active: false
      },
      editing: false,
      menuDateInitial: false,
      menuDateFinal: false,
      readOnlyData: false,
      analysts: [],
      groups: [],
      status: [],
      categories: [],
      priorities: [],
      initial: new Date().toISOString().substr(0, 10),
      final: new Date().toISOString().substr(0, 10),
      comment: '',
      keymap: {
        'alt+a': () => {
          this.action.active = true
        }
      }
    }
  },
  computed: {
    ticket: {
      get() {
        if (!this.search) return this.$store.getters['ticket/getActualTicket']
        return this.value
      },
      set(value) {
        this.$store.commit('ticket/setActualTicket', value)
      }
    },
    ...mapGetters({
      user: 'auth/getUser',
      ticketsToEdit: 'ticket/getTicketsToEdit'
    }),
    allowedStatus() {
      if (this.search) return this.status
      if (!this.ticket.status) return this.status
      if (!this.editing) return this.status
      const statusIndex = this.status.findIndex(s => {
        return s._id === this.ticket.status._id
      })

      const result = [this.ticket.status]
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
          this.$store.commit('ticket/setFieldInActualTicket', {
            value: openedBy,
            field: 'openedBy'
          })
        }
        this.groups = response.data.Group
        this.status = response.data.Status
        this.categories = response.data.Category
        this.priorities = response.data.priority
      })
  },
  methods: {
    setFieldInActualTicket(value, field) {
      this.$store.commit('ticket/setFieldInActualTicket', { field, value })
    },
    addComment() {
      const comment = {
        content: this.comment
      }
      this.$axios
        .post(`/ticket/comment/${this.ticket._id}`, comment)
        .then(response => {
          this.comment = ''
          this.$store.commit('ticket/addComment', response.data)
        })
    },
    save() {
      if (!this.search && this.$refs.form.validate()) {
        this.$emit('input', this.ticket)
        this.readOnlyData = true
        this.editing = false
      } else {
        this.$emit('input', this.ticket)
      }
    },
    edit() {
      this.readOnlyData = false
      this.editing = true
    },
    cancelEdit() {
      this.editing = false
      this.readOnlyData = true
      this.$axios.get(`/ticket/${this.ticket._id}`).then(response => {
        this.$store.commit('ticket/setActualTicket', response.data)
      })
    },
    changeCategory(category) {
      this.setFieldInActualTicket(category, 'category')
      if (this.search) return
      if (!this.ticket.category) return
      this.checkFields()
      this.changeValue('groups', 'group', 'defaultGroup')
      this.changeValue('status', 'status', 'defaultStatus')
      this.changeValue('priorities', 'priority', 'defaultPriority')
    },
    changeValue(search, type, defaultAttr) {
      if (!this.ticket.category[defaultAttr]) return
      const index = this[search].findIndex(s => {
        return s._id === this.ticket.category[defaultAttr]._id
      })
      if (
        this.ticket[type] === undefined ||
        (Object.prototype.hasOwnProperty.call(this.ticket, type) &&
          !Object.prototype.hasOwnProperty.call(this.ticket[type], '_id'))
      ) {
        this.setFieldInActualTicket(this[search][index], type)
      }
    },
    checkFields() {
      if (!Object.prototype.hasOwnProperty.call(this.ticket.category, 'fields'))
        return
      this.ticket.fields = this.ticket.category.fields
    },
    clearFields() {
      this.$store.commit('ticket/resetActualTicket')
      this.value = this.$store.getters['ticket/getActualTicket']
    }
  }
}
</script>
