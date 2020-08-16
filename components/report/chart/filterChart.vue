<template>
  <v-row>
    <v-col
      cols="12"
      pa-3
    >
      <h4>{{ $t('filters') }}</h4>
      <v-row>
        <v-col
          cols="12"
          md="4"
          pa-3
        >
          <v-autocomplete
            v-model="baseGroups"
            multiple
            filled
            :label="$t('groups')"
            :items="
              groups.map((g) => {
                return { text: g.name, value: g.id }
              })
            "
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
          pa-3
        >
          <v-autocomplete
            v-model="baseStatus"
            multiple
            filled
            :label="$t('status')"
            :items="
              status.map((g) => {
                return { text: g.name, value: g.id }
              })
            "
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
          pa-3
        >
          <v-autocomplete
            v-model="baseAnalysts"
            multiple
            filled
            :label="$t('opened_by')"
            :items="
              analysts.map((g) => {
                return { text: g.name, value: g.id }
              })
            "
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      base: 'report/filter/getBase',
      groups: 'group/getGroups',
      status: 'status/getStatus',
      analysts: 'analyst/getAnalysts',
    }),
    baseGroups: {
      get() {
        return this.$store.getters['report/filter/getGroups'];
      },
      set(value) {
        this.$store.commit('report/filter/setGroups', value);
      },
    },
    baseAnalysts: {
      get() {
        return this.$store.getters['report/filtert/getOpenedBy'];
      },
      set(value) {
        this.$store.commit('report/filter/setOpenedBy', value);
      },
    },
    baseStatus: {
      get() {
        return this.$store.getters['report/filter/getStatus'];
      },
      set(value) {
        this.$store.commit('report/filter/setStatus', value);
      },
    },
  },
};
</script>

<style></style>
