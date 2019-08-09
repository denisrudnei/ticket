<template>
  <v-dialog
    v-if="chat"
    v-model="chat"
    scrollable
  >
    <v-card>
      <v-toolbar
        class="primary white--text"
      >
        <v-avatar>
          <img :src="chat.to.picture">
        </v-avatar>
        <v-spacer />
        {{ chat.to.name }}
        <v-toolbar-items>
          <v-btn
            icon
            class="white--text"
            @click="hide()"
          >
            <v-icon>
              close
            </v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-timeline
          class="expand"
          dense
        >
          <v-timeline-item
            v-for="message in messages"
            :key="message._id"
          >
            <template
              v-slot:icon
            >
              <v-avatar>
                <img :src="message.from.picture" alt="">
              </v-avatar>
            </template>
            <v-card>
              <v-card-title class="headline">
                {{ message.name }}
              </v-card-title>
              <v-card-text>
                {{ message.content }}
                <hr>
                <sub>{{ message.date | date }}</sub>
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
      <v-card-actions>
        <v-text-field
          v-model="text"
          box
          label="Envie um texto"
          @keydown.enter="addMessage()"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      text: ''
    }
  },
  computed: mapGetters({
    user: 'auth/getUser',
    analysts: 'analyst/getAnalysts',
    messages: 'chat/getMessages',
    chat: 'chat/getActive',
    chats: 'chat/getChats',
    visible: 'chat/getVisible',
    logged: 'auth/getLogged'
  }),
  mounted() {
    this.$socket.on('message', value => {
      this.$store.commit('chat/receiveMessage', value)
    })
    this.$socket.on(`message/${this.user._id}`, message => {
      this.$toast.show('Mensagem recebida', {
        duration: 1000
      })

      this.$store.commit('chat/receiveMessage', message)
    })
  },
  created() {
    this.$axios.get('/analyst').then(response => {
      response.data.forEach(a => {
        this.$store.dispatch('chat/getMessages', a)
      })
    })
  },
  methods: {
    addMessage() {
      this.$store.dispatch('chat/addMessage', {
        chatId: this.chat.id,
        content: this.text,
        date: new Date(),
        name: this.user.name,
        picture: this.user.picture,
        to: this.chat.to,
        from: this.user
      })
      this.text = ''
    },
    hide() {
      this.$store.commit('chat/setVisible', false)
    }
  }
}
</script>

<style>
</style>
