<template>
  <v-row>
    <v-col
      cols="12"
      md="4"
    >
      <v-text-field
        :value="ticket.status.name"
        readonly
        filled
        :label="$t('status')"
      />
    </v-col>
    <v-col
      cols="12"
      md="4"
    >
      <v-text-field
        :value="ticket.group.name"
        readonly
        filled
        :label="$t('actual_group')"
      />
    </v-col>
    <v-col
      v-if="ticket.actualUser"
      cols="12"
      md="4"
    >
      <v-text-field
        :value="ticket.actualUser.name"
        readonly
        filled
        :label="$t('actual_user')"
      />
    </v-col>
    <v-col cols="12">
      <span>Prazo de atendimento</span>
      <v-progress-linear
        :value="ticket.slaPercentage"
        color="green"
        striped
        height="15"
      >
        {{ ticket.slaPercentage | percentage }}
      </v-progress-linear>
    </v-col>
    <v-col cols="12">
      <v-text-field
        :value="ticket.resume"
        readonly
        filled
        :label="$t('resume')"
      />
    </v-col>
    <v-col cols="12">
      <v-textarea
        :value="ticket.content"
        readonly
        filled
        :label="$t('content')"
      />
    </v-col>
    <v-tabs>
      <v-tab>
        {{ $t('files') }}
      </v-tab>
      <v-tab-item>
        <v-data-table />
      </v-tab-item>
    </v-tabs>
  </v-row>
</template>

<script>

import ticketById from '@/graphql/query/client/ticket/ticketById';

export default {
  filters: {
    percentage(value) {
      return `${Math.round(value)} %`;
    },
  },
  layout: 'client',
  asyncData({ params, app }) {
    return app.apolloProvider.defaultClient
      .query({
        query: ticketById,
        variables: {
          id: params.id,
        },
      })
      .then((response) => ({
        ticket: response.data.ticket,
      }));
  },
};
</script>

<style></style>
