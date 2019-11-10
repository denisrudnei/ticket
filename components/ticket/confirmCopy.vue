<template>
  <v-dialog :value="value" max-width="50vw" persistent>
    <v-card>
      <v-card-title>
        {{ $t('confirm_copy') }}
      </v-card-title>
      <v-card-actions>
        <v-row>
          <v-col>
            <v-btn tile block class="primary white--text" @click="yes">
              {{ $t('yes') }}
            </v-btn>
          </v-col>
          <v-col>
            <v-btn tile block class="primary white--text" @click="no">
              {{ $t('no') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: mapGetters({
    value: 'ticket/getConfirmCopy',
    ticket: 'ticket/getTicketToCopy'
  }),
  methods: {
    yes() {
      this.$emit('update', this.ticket)
    },
    no() {
      this.$store.commit('ticket/setConfirmCopy', false)
    }
  }
}
</script>

<style>
</style>
