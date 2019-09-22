<template>
  <v-row>
    <v-col>
      <list-ticket />
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import ListTicket from '@/components/ticket/list'
export default {
  components: {
    ListTicket
  },
  computed: mapGetters({
    user: 'auth/getUser'
  }),
  asyncData({ params }) {
    return {
      type: params.type
    }
  },
  created() {
    this.$store.commit('ticket/setQuery', {
      [this.type]: this.user._id
    })
  }
}
</script>

<style>
</style>
