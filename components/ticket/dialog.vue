<template>
  <v-dialog :value="dialog === actualTicket.id" fullscreen scrollable>
    <v-card>
      <v-toolbar fixed class="primary white--text">
        <v-toolbar-items>
          <v-btn class="primary white--text" icon @click="setDialog('')">
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
          <v-col cols="12">
            <create-ticket
              v-model="actualTicket"
              :readonly="true"
              @input="update()"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import ggl from 'graphql-tag';
import CreateTicket from '@/components/ticket/create';
import ticketEdit from '@/graphql/mutation/ticket/editTicket.graphql';

export default {
  name: 'TicketDialog',
  components: {
    CreateTicket,
  },
  computed: {
    actualTicket: {
      get() {
        return this.$store.getters['ticket/getActualTicket'];
      },
      set(value) {
        this.$store.commit('ticket/setActualTicket', value);
      },
    },
    ...mapGetters({
      dialog: 'ticket/getDialog',
    }),
  },
  methods: {
    setDialog() {
      this.$store.commit('ticket/setDialog', '');
    },
    done(id) {
      this.$store.commit('ticket/removeFromEdit', id);
      this.setDialog();
    },
    update() {
      this.$apollo
        .mutate({
          mutation: ggl(ticketEdit),
          variables: {
            id: this.actualTicket.id,
            ticket: {
              resume: this.actualTicket.resume,
              content: this.actualTicket.content,
              address: this.actualTicket.address.id,
              status: this.actualTicket.status.id,
              group: this.actualTicket.group.id,
              category: this.actualTicket.category.id,
              priority: this.actualTicket.priority.id,
              affectedUser: this.actualTicket.affectedUser.id,
              actualUser: this.actualTicket.actualUser.id,
            },
          },
        })
        .then((response) => {
          this.$toast.show(this.$t('updated'), {
            duration: 1000,
            icon: 'done',
          });
        });
    },
  },
};
</script>

<style></style>
