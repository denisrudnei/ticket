<template>
  <v-row>
    <v-col cols="12">
      <v-btn class="primary white--text" @click="dialog = !dialog">
        <v-icon>add</v-icon>
        {{ $t('add_children') }}
      </v-btn>
      <v-dialog v-model="dialog" scrollable>
        <v-card>
          <v-toolbar color="primary white--text">
            <v-toolbar-items>
              <v-btn class="primary white--text" icon @click="dialog = !dialog">
                <v-icon>
                  close
                </v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-stepper v-model="step">
                  <v-stepper-header>
                    <v-stepper-step :complete="step > 1" :step="1" @click="step = 1">
                      {{ $t('search_ticket') }}
                    </v-stepper-step>
                    <v-divider />
                    <v-stepper-step :step="2" :complete="step == 2">
                      {{ $t('select_ticket') }}
                    </v-stepper-step>
                  </v-stepper-header>
                  <v-stepper-content step="1">
                    <create name="TicketCreate" search @input="search" />
                  </v-stepper-content>
                  <v-stepper-content step="2">
                    <list v-model="tickets" @input="addChildren" />
                  </v-stepper-content>
                </v-stepper>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-col>
    <v-col
      cols="12"
      pa-3
    >
      <v-data-table
        :items="actualTicket.children"
        :headers="headers"
      >
        <template
          v-slot:item.ticketNumber="{ item }"
        >
          {{ item.ticketNumber }}
        </template>
        <template v-slot:item.resume="{ item }">
          {{ item.resume }}
        </template>
        <template v-slot:item.status="{ item }">
          {{ item.status.name }}
        </template>
        <template v-slot:item.group="{ item }">
          {{ item.group.name }}
        </template>
        <template v-slot:item.category="{ item }">
          {{ item.category.fullName }}
        </template>
        <template v-slot:item.created="{ item }">
          {{ item.created | date }}
        </template>
        <template v-slot:item.modified="{ item }">
          {{ item.modified | date }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn class="red white--text" icon @click="removeChildren(item)">
            <v-icon>
              delete
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import ggl from 'graphql-tag'
import create from '../create'
import list from '@/components/ticket/children/search/list'
import search from '@/graphql/query/search/ticket.graphql'
import addChildren from '@/graphql/mutation/ticket/addChildren.graphql'
import removeChildren from '@/graphql/mutation/ticket/removeChildren.graphql'
export default {
  name: 'Children',
  components: {
    list,
    create
  },
  data() {
    return {
      dialog: false,
      step: 1,
      tickets: []
    }
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t('actions'),
          value: 'actions'
        },
        {
          text: this.$t('number_of_ticket'),
          value: 'ticketNumber'
        },
        {
          text: this.$t('status'),
          value: 'status'
        },
        {
          text: this.$t('group'),
          value: 'group'
        },
        {
          text: this.$t('resume'),
          value: 'resume'
        },
        {
          text: this.$t('status'),
          value: 'status'
        },
        {
          text: this.$t('group'),
          value: 'group'
        },
        {
          text: this.$t('category'),
          value: 'category'
        },
        {
          text: this.$t('creation_date'),
          value: 'created'
        },
        {
          text: this.$t('modified_date'),
          value: 'modified'
        }
      ]
    },
    ...mapGetters({
      actualTicket: 'ticket/getActualTicket'
    })
  },
  created() {
    this.$options.components.create = create
  },
  methods: {
    search(ticket) {
      const newTicket = {}
      Object.keys(ticket).forEach(k => {
        if (
          ticket[k] !== undefined &&
          Object.prototype.hasOwnProperty.call(ticket[k], '_id')
        ) {
          newTicket[k] = ticket[k]._id
        }
      })
      const fieldsToExclude = ['CreateTicketd', 'modified', 'resume', 'content']
      fieldsToExclude.forEach(f => {
        delete newTicket[f]
      })
      this.$apollo
        .query({
          query: ggl(search),
          variables: {
            attributes: newTicket
          }
        })
        .then(response => {
          this.tickets = response.data.Tickets.docs
          this.step = 2
        })
    },
    addChildren(children) {
      this.dialog = false
      this.$store.commit('ticket/addChildren', children)
      this.$apollo
        .mutate({
          mutation: ggl(addChildren),
          variables: {
            ticketId: this.actualTicket._id,
            children: children.map(t => t._id)
          }
        })
        .then(() => {
          this.step = 1
          this.$toast.show(this.$t('children_added'), {
            duration: 1000,
            icon: 'done'
          })
        })
    },
    removeChildren(children) {
      this.dialog = false
      this.$store.commit('ticket/removeChildren', children)
      this.$apollo
        .mutate({
          mutation: ggl(removeChildren),
          variables: {
            ticketId: this.actualTicket._id,
            childrenId: children._id
          }
        })
        .then(() => {
          this.$toast.show(this.$t('children_removed'), {
            duration: 1000,
            icon: 'done'
          })
        })
    }
  }
}
</script>

<style>
</style>
