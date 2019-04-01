<template>
  <v-dialog
    :value="visible"
    width="90vw"
    v-if="chat"
  >
    <v-layout
      row
      wrap
      class="fixed"
      justify-end
    >
      <v-toolbar
        class="primary white--text"
      >
        <v-avatar>
         <img :src="chat.to.picture" />
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
      <v-flex
        xs12
        pa-2
        class="white"
      >
        <v-timeline>
          <v-timeline-item
            v-for="message in messages"
            :key="message._id"
            hide-dot
          >
            <v-card>
              <v-card-title
                class="primary white--text"
              >
                {{ message.name }}
                <v-spacer />
                <v-avatar>
                  <img :src="message.picture" alt="">
                </v-avatar>
              </v-card-title>
              <v-card-text>
                teste
                <hr>
                <sub>{{ new Date() | date }}</sub>
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
        <v-textarea
          box
          label="Envie um texto"
          @keydown.enter="addMessage()"
        />
      </v-flex>
    </v-layout>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  async created() {
    await this.$axios.get('api/analyst').then(response => {
      response.data.forEach(a => {
        this.$store.commit('chat/createChat', a)
      })
    })
  },
  computed: mapGetters({
    analysts: 'analyst/getAnalysts',
    messages: 'chat/getMessages',
    chat: 'chat/getActive',
    visible: 'chat/getVisible'
  }),
  methods: {
    addMessage() {
      this.$store.commit('chat/createChat', 'fulano')
    },
    hide() {
      this.$store.commit('chat/setVisible', false)
    }
  }
}
</script>
