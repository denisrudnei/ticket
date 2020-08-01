<template>
  <v-row>
    <v-col cols="12" pa-3>
      <v-timeline align-top>
        <v-timeline-item
          v-for="(log, index) in ticket.logs"
          :key="index"
          :right="sameGroup(index, log.group)"
          small
        >
          <template v-slot:opposite>
            <span>{{ log.oldStatus.name }}</span>
          </template>
          <template v-slot:icon>
            <v-avatar>
              <img :src="log.user.picture" />
            </v-avatar>
          </template>

          <v-card>
            <v-card-title class="headline">
              {{ log.group.name }}
            </v-card-title>
            <v-card-text>
              Status: {{ log.oldStatus.name }}
              <hr />
              Atualizado por: {{ log.user.name }} em {{ log.date | date }}
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    headers() {
      return [
        {
          text: this.$t('user'),
          value: 'user',
        },
        {
          text: this.$t('date'),
          value: 'date',
        },
        {
          text: this.$t('status'),
          value: 'status.name',
        },
        {
          text: this.$t('group'),
          value: 'group.name',
        },
      ];
    },
    ...mapGetters({
      ticket: 'ticket/getActualTicket',
    }),
  },
  methods: {
    sameGroup(index, group) {
      if (index === 0) return true;
      if (this.ticket.logs[index - 1].group.name === group.name) return true;
      return false;
    },
  },
};
</script>

<style></style>
