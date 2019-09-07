<template>
  <v-row>
    <v-col>
      <list-ticket
        :url="`/ticket/profile/${type}`"
      />
    </v-col>
  </v-row>
</template>

<script>
import ListTicket from '@/components/ticket/list'
export default {
  components: {
    ListTicket
  },
  asyncData({ params }) {
    return {
      type: params.type
    }
  }
}
</script>

<style>
</style>
