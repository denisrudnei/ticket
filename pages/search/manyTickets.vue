<template>
  <v-row>
    <v-col cols="4">
      <v-text-field
        v-model="ticketsText"
        label="Números"
        filled
        @keyup="update"
      />
    </v-col>
    <v-col cols="8">
      <v-card>
        <v-card-title>
          Chamados para pesquisar
        </v-card-title>
        <v-card-text>
          <template v-for="ticket in ticketsNumbers">
            <v-chip :key="ticket" label class="ma-2 primary white--text" ma-2>
              <v-icon class="white--text">
                bolt
              </v-icon>
              {{ ticket }}
            </v-chip>
          </template>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-btn class="primary white--text" @click="search">
        Pesquisar
        <v-icon right>
          search
        </v-icon>
      </v-btn>
    </v-col>
    <v-col>
      <ticket-list :url="'/search/'" />
    </v-col>
  </v-row>
</template>

<script>
import TicketList from '@/components/ticket/list'
export default {
  components: {
    TicketList
  },
  data() {
    return {
      ticketsText: '',
      ticketsNumbers: []
    }
  },
  methods: {
    update(evt) {
      this.ticketsText = this.ticketsText.replace(/[^\d]/g, '')
      if (evt.key === 'Enter') {
        this.ticketsNumbers.push(parseInt(this.ticketsText))
        this.ticketsText = ''
      }
    },
    search() {
      const query = {
        ticketNumber: this.ticketsNumbers.map(n => parseInt(n))
      }
      this.$store.commit('ticket/setQuery', query)
    }
  }
}
</script>

<style>
</style>
