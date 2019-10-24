<template>
  <v-row>
    <v-col>
      <v-text-field v-model="search" filled label="Pesquisar" prepend-icon="search" />
    </v-col>
    <v-col cols="12">
      <v-row>
        <v-col v-for="ticket in tickets" :key="ticket._id" cols="4">
          <v-card tile :color="color()" class="white--text" dark>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="4">
                  <v-progress-circular color="white" :size="100" :value="100">
                    {{ sla() }}
                  </v-progress-circular>
                </v-col>
                <v-col cols="12" md="8">
                  <nuxt-link :to="`/client/ticket/view/${ticket._id}`" tag="span">
                    <v-card-title>
                      {{ ticket.resume }}
                    </v-card-title>
                  </nuxt-link>
                </v-col>
                <v-col cols="12">
                  <v-progress-linear height="10" :value="sla()" color="white" />
                </v-col>
                <v-col cols="12">
                  <v-text-field readonly label="Status" :value="ticket.status.name" filled />
                  <v-text-field readonly label="Grupo atual" :value="ticket.group.name" filled />
                  <v-text-field filled :value="ticket.created | date" label="Criado em" />
                  <v-text-field filled :value="ticket.modified | date" label="Modificado em" />
                </v-col>
                <v-col cols="12">
                  <v-btn :to="`/client/ticket/view/${ticket._id}`">
                    Ver detalhes
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
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
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
      ticketsData: []
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
  mounted() {
    this.$axios
      .get(`/ticket/profile/openedBy/?openedBy=${this.user._id}`)
      .then(response => {
        this.ticketsData = response.data.docs
      })
  },
  methods: {
    color() {
      const colors = ['red', 'green', 'orange', 'blue', 'purple', 'black']
      return colors[Math.round(Math.random() * colors.length)]
    },
    sla() {
      return `${Math.round(Math.random() * 100)} %`
    }
  }
}
</script>

<style>
</style>
