<template>
  <v-card>
    <v-select
      :value="user.status"
      :items="status"
      filled
      label="Status online"
      @change="changeStatus"
    />
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import ChangeStatus from '@/graphql/mutation/chat/changeStatus.graphql';
import status from '@/graphql/query/chat/status.graphql';
import ggl from 'graphql-tag';

export default {
  data() {
    return {
      status: [],
    };
  },
  computed: mapGetters({
    user: 'auth/getUser',
  }),
  created() {
    this.$apollo
      .query({
        query: ggl(status),
      })
      .then((response) => {
        this.status = response.data.AnalystStatus.map((s) => ({
          value: s[1],
          text: this.$t(s[0]),
        }));
      });
  },
  methods: {
    changeStatus(value) {
      this.$apollo
        .mutate({
          mutation: ggl(ChangeStatus),
          variables: {
            status: value,
          },
        })
        .then(() => {
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
