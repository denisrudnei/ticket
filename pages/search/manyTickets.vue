<template>
  <v-row>
    <v-col cols="4">
      <v-textarea
        v-model="ticketsText"
        filled
        label="Vários chamados em lista"
        append-icon="add"
        @click:append="addOneNumber(ticketsText)"
        @keyup="update"
      />
    </v-col>
    <v-col cols="8">
      <v-card>
        <v-card-title>
          {{ $t('tickets_to_search') }}
        </v-card-title>
        <v-card-text>
          <template v-for="ticket in ticketsNumbers">
            <v-chip
              :key="ticket"
              label
              class="ma-2"
              color="primary"
              text-color="white"
              close
              @click:close="removeNumber(ticket)"
            >
              <v-icon class="white--text">
                bolt
              </v-icon>
              {{ ticket }}
            </v-chip>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="ticketsNumbers.length > 0" class="primary white--text" @click="ticketsNumbers = []">
            {{ $t('remove_all') }}
            <v-icon right>
              remove
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-btn class="primary white--text" @click="search">
        {{ $t('search') }}
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
      this.ticketsText = this.ticketsText.replace(/[^\d|,| |\n]/g, '')
      if (evt.key === 'Enter') {
        const numbers = Array.from(
          new Set(
            this.ticketsText.split(/[^\d]/).filter(number => {
              return !isNaN(parseInt(number))
            })
          )
        )
        this.ticketsNumbers = Array.from(
          new Set([...this.ticketsNumbers, ...numbers])
        )
        this.ticketsText = ''
      }
    },
    search() {
      const query = {
        ticketNumber: this.ticketsNumbers.map(n => parseInt(n))
      }
      this.$store.commit('ticket/setQuery', query)
    },
    removeNumber(value) {
      this.ticketsNumbers = this.ticketsNumbers.filter(number => {
        return number !== value
      })
    }
  }
}
</script>

<style>
</style>
