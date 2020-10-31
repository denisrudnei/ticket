<template>
  <v-row>
    <v-col
      cols="12"
      pa-3
    >
      <v-data-table
        :items="actualTicket.comments"
        :headers="headers"
      >
        <template #item.user="{ item }">
          {{ item.user.name }}
        </template>
        <template #item.date="{ item }">
          {{ item.date | date }}
        </template>
        <template #item.content="{ item }">
          {{ item.content }}
        </template>
      </v-data-table>
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
          text: this.$t('name'),
          value: 'user',
        },
        {
          text: this.$t('date'),
          value: 'date',
        },
        {
          text: this.$t('comment'),
          value: 'content',
        },
      ];
    },
    ...mapGetters({
      actualTicket: 'ticket/getActualTicket',
    }),
  },
};
</script>

<style></style>
