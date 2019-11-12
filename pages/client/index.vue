<template>
  <v-row>
    <v-col>
      <v-text-field v-model="search" filled :label="$t('search')" prepend-icon="search" />
    </v-col>
    <v-col cols="12">
      <v-row>
        <v-col v-for="ticket in tickets" :key="ticket._id" cols="12" md="4">
          <v-card tile :color="color(ticket._id)" class="white--text" dark>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <nuxt-link :to="`/client/ticket/view/${ticket._id}`" tag="span">
                    <v-card-title class="text-center">
                      <p>{{ ticket.resume }}</p>
                    </v-card-title>
                  </nuxt-link>
                </v-col>
                <v-col>
                  {{ $t('number_of_ticket') }}: {{ ticket.ticketNumber }}
                </v-col>
                <v-col cols="12">
                  <v-progress-linear striped height="15" :value="sla(ticket._id)" color="black">
                    {{ sla(ticket._id) }} %
                  </v-progress-linear>
                </v-col>
                <v-col cols="12">
                  <v-text-field readonly :label="$t('status')" :value="ticket.status.name" filled />
                  <v-text-field readonly :label="$t('actual_group')" :value="ticket.group.name" filled />
                  <v-text-field filled :value="ticket.created | date" :label="$t('creation_date')" />
                  <v-text-field filled :value="ticket.modified | date" :label="$t('modified_date')" />
                </v-col>
                <v-col cols="12">
                  <v-btn :to="`/client/ticket/view/${ticket._id}`" block tile>
                    {{ $t('see_details') }}
                    <v-icon right>
                      search
                    </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-pagination v-model="page" :value="page" :total-visible="10" :length="pages" />
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import ggl from 'graphql-tag'
import listTicket from '@/graphql/query/client/ticket/searchTicket.graphql'
export default {
  layout: 'client',
  filters: {
    limit(value) {
      return value.substr(0, 100)
    }
  },
  data() {
    return {
      search: '',
      ticketsData: [],
      page: 1,
      pages: 0,
      slas: []
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/getUser'
    }),
    tickets() {
      return this.ticketsData.filter(ticket => {
        return ticket.resume.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },
  watch: {
    page(value) {
      this.getTickets(value)
    }
  },
  mounted() {
    this.getTickets()
  },
  methods: {
    color(id) {
      const sla = this.slas.find(s => {
        return s.id === id
      })
      if (!sla) {
        this.sla(id)
        return 'black'
      }
      if (sla.number <= 90) return 'green'
      if (sla.number >= 100) return 'red'
      return 'orange'
    },
    sla(id) {
      const number = Math.round(Math.random() * 100)
      const findSla = this.slas.findIndex(sla => {
        return sla.id === id
      })
      const sla = {
        id,
        number
      }
      if (findSla !== -1) {
        return this.slas[findSla].number
      } else {
        this.slas.push(sla)
      }
      return sla.number
    },
    getTickets(page) {
      this.$apollo
        .query({
          query: ggl(listTicket),
          variables: {
            page: page || 1,
            limit: 9,
            attributes: {
              openedBy: this.user._id
            }
          }
        })
        .then(response => {
          this.pages = response.data.ticket.pages
          this.ticketsData = response.data.ticket.docs
        })
    }
  }
}
</script>

<style scoped>
p {
  word-break: break-word !important;
}
</style>
