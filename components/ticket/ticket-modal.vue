<template>
  <v-dialog
    v-model="showModal"
    scrollable
  >
    <v-card>
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            pa-3
          >
            <ticket-list
              v-if="showModal"
              :url="`/search/`"
              :modal="true"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import TicketList from '@/components/ticket/list';

export default {
  components: {
    TicketList,
  },
  computed: {
    showModal: {
      get() {
        return this.$store.getters['ticket/getModalList'];
      },
      set(value) {
        this.$store.commit('ticket/setModalList', value);
      },
    },
  },
};
</script>

<style></style>
