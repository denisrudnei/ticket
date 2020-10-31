<template>
  <v-dialog
    v-if="chat"
    v-model="chat"
    scrollable
    width="75vw"
  >
    <v-card>
      <v-toolbar class="primary white--text">
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
            :key="message.id"
          >
            <template #icon>
              <v-avatar>
                <img
                  :src="message.from.picture"
                  alt=""
                >
              </v-avatar>
            </template>
            <v-card>
              <v-card-title class="headline">
                {{ message.from.name }}
              </v-card-title>
              <v-card-text>
                <div v-html="message.content" />
                <sub>{{ message.date | date }}</sub>
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
      <v-card-actions>
        <v-row>
          <v-col
            id="editor"
            cols="12"
          >
            <client-only>
              <ckeditor
                v-model="text"
                :editor="editor"
                @ready="configureEditor"
              />
            </client-only>
          </v-col>
          <v-col cols="12">
            <v-btn
              icon
              @click="addMessage()"
            >
              <v-icon>
                send
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';

import Chat from '@/graphql/query/chat/chat';
import newMessage from '@/graphql/subscription/chat/newMessage';
import ImageUploadAdapter from '@/plugins/image-upload-adapter';

export default {
  data() {
    return {
      editor: '',
      text: '',
    };
  },
  computed: mapGetters({
    user: 'auth/getUser',
    analysts: 'analyst/getAnalysts',
    messages: 'chat/getMessages',
    chat: 'chat/getActive',
    chats: 'chat/getChats',
    visible: 'chat/getVisible',
    logged: 'auth/getLogged',
  }),
  apollo: {
    $subscribe: {
      newMessage: {
        query: newMessage,
        variables() {
          return { to: this.user.id };
        },
        result({ data }) {
          this.$store.commit('chat/addMessage', data.message);
          this.$toast.show('Mensagem recebida', {
            duration: 1000,
            icon: 'chat',
          });
        },
      },
    },
  },
  mounted() {
    this.editor = require('@ckeditor/ckeditor5-build-classic');
  },
  created() {
    this.$apollo
      .query({
        query: Chat,
      })
      .then((response) => {
        this.$store.commit('chat/setChats', response.data.chat);
      });
  },
  methods: {
    addMessage() {
      this.$store.dispatch('chat/send', {
        content: this.text,
        date: new Date(),
        to: this.other(this.chat.participants).id,
      });
      this.text = '';
    },
    hide() {
      this.$store.commit('chat/setVisible', false);
    },
    other(value) {
      return value.find((participant) => participant.id !== this.user.id);
    },
    configureEditor(editor) {
      editor.plugins.get('FileRepository').createUploadAdapter = (loader) => new ImageUploadAdapter(loader, this.$axios);
    },
  },
};
</script>

<style>
figure > img {
  max-width: 100%;
}

.ck-editor__editable_inline {
  max-height: 15vh !important;
}
</style>
