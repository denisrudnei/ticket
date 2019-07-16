<template>
  <v-dialog
    lazy
    :value="dialog === actualTicket._id"
    fullscreen
  >
    <v-card>
      <v-card-title>
        <v-toolbar
          fixed
          card
          class="primary white--text"
        >
          <v-toolbar-items>
            <v-btn
              class="primary white--text"
              icon
              @click="setDialog('')"
            >
              <v-icon>
                close
              </v-icon>
            </v-btn>
            <v-btn class="primary white--text" icon @click="done(dialog)">
              <v-icon>
                done
              </v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-layout
          row
          wrap
        >
          <v-flex
            xs12
            pa-2
          >
            <create-ticket
              v-model="ticket"
              :readonly="true"
              :ticket="actualTicket"
              @input="update()"
            />
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import CreateTicket from '@/components/ticket/create'

export default {
  components: {
    CreateTicket
  },
  data() {
    return {
      ticket: {}
    }
  },
  computed: mapGetters({
    dialog: 'ticket/getDialog',
    actualTicket: 'ticket/getActualTicket'
  }),
  methods: {
    setDialog() {
      this.$store.commit('ticket/setDialog', '')
    },
    done(id) {
      this.$store.commit('ticket/removeFromEdit', id)
      this.setDialog()
    },
    update() {
      this.$axios
        .put(`/ticket/${this.actualTicket._id}`, this.ticket)
        .then(() => {
          this.$toast.show('Atualizado', {
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
