<template>
  <v-layout
    row
    wrap
  >
    <v-flex
      xs12
      pa-2
    >
      <v-timeline>
        <v-timeline-item
          v-for="(c, index) in messages"
          :key="index"
          :left="current.email === c.name"
          :right="current.email !== c.name"
          hide-dot
        >
          <v-card>
            <v-card-title>
              <v-avatar>
                <v-img
                  :src="c.from.picture"
                />
              </v-avatar>
              <v-flex
                pa-2
              >
                {{ c.name }}
              </v-flex>
            </v-card-title>
            <v-card-text>
              {{ c.content }}
            </v-card-text>
          </v-card>
        </v-timeline-item>
        <v-textarea
          v-model="content"
          box
          placeholder="Insira um texto"
          @keydown.enter="add()"
        />
      </v-timeline>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      content: ''
    }
  },
  computed: mapGetters({
    messages: 'message/getMessages',
    current: 'auth/getUser'
  }),
  mounted() {
    this.$socket.on('message', message => {
      /* eslint-disable-next-line */
      this.$store.commit('message/addMessage', message)
    })
  },
  methods: {
    add() {
      this.$axios.post('api/chat/message', {
        to: this.current,
        from: this.current,
        content: this.content
      })
      this.content = ''
    }
  }
}
</script>

<style>
</style>
