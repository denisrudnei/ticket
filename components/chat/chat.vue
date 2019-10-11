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
          <img :src="other(chat.participants).picture">
        </v-avatar>
        <v-spacer />
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
                {{ message.from.name }}
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
          filled
          label="Envie um texto"
          @keydown.enter="addMessage()"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import ggl from 'graphql-tag'
import Chat from '@/graphql/query/chat/chat.graphql'
import newMessage from '@/graphql/subscription/chat/newMessage.graphql'
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
  apollo: {
    $subscribe: {
      newMessage: {
        query: ggl(newMessage),
        variables() {
          return { to: this.user._id }
        },
        result({ data }) {
          this.$store.commit('chat/addMessage', data.message)
          this.$toast.show('Mensagem recebida', {
            duration: 1000,
            icon: 'chat'
          })
        }
      }
    }
  },
  created() {
    this.$apollo
      .query({
        query: ggl(Chat)
      })
      .then(response => {
        this.$store.commit('chat/setChats', response.data.chat)
      })
  },
  methods: {
    addMessage() {
      this.$store.dispatch('chat/send', {
        content: this.text,
        date: new Date(),
        to: this.other(this.chat.participants)._id
      })
      this.text = ''
    },
    hide() {
      this.$store.commit('chat/setVisible', false)
    },
    other(value) {
      return value.find(participant => {
        return participant._id !== this.user._id
      })
    }
  }
}
</script>

<style>
</style>
