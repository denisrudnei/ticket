<template>
  <v-dialog
    :value="dialog === actualTicket._id"
    fullscreen
    scrollable
  >
    <v-card>
      <v-toolbar
        fixed
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
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
          >
            <create-ticket
              v-model="ticket"
              :readonly="true"
              :ticket="actualTicket"
              @input="update()"
            />
          </v-col>
        </v-row>
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
    transformPopulatedToIds(ticket) {
      const result = {}
      const dontReplace = ['comments', 'logs', 'created', 'modified']
      for (const field in ticket) {
        if (dontReplace.includes(field)) continue
        if (Object.prototype.hasOwnProperty.call(ticket[field], '_id')) {
          result[field] = {
            _id: ticket[field]._id
          }
        } else {
          result[field] = ticket[field]
        }
      }
      return result
    },
    update() {
      this.$axios
        .put(
          `/ticket/${this.actualTicket._id}`,
          this.transformPopulatedToIds(this.ticket)
        )
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
