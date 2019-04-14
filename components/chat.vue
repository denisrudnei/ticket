<template>
  <div
    v-if="chat"
    class="fixed"
  >
    <v-flex
      xs12
      class="white"
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
        <v-timeline
          class="expand"
        >
          <v-timeline-item
            v-for="message in messages"
            :key="message._id"
            hide-dot
          >
            <v-card>
              <v-card-title>
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
      </v-card>
    </v-flex>
    <v-card
      class="bottom" 
    >
      <v-text-field
        box
        label="Envie um texto"
        @keydown.enter="addMessage()"
      />
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters({
    analysts: 'analyst/getAnalysts',
    messages: 'chat/getMessages',
    chat: 'chat/getActive',
    visible: 'chat/getVisible'
  }),
  async created() {
    await this.$axios.get('api/analyst').then(response => {
      response.data.forEach(a => {
        this.$store.commit('chat/createChat', a)
      })
    })
  },
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

<style scoped>
.fixed {
  z-index: 9999;
  position: fixed;
  display: flex;
  right: 0.8vw;
  bottom: 0;
  height: 65vh;
  width: 33vw;
  background: white;
}

.expand {
  flex: 1;
  flex-direction: column;
}

.bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
  box-sizing: content-box;
}
</style>
