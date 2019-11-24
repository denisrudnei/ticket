<template>
  <v-row>
    <v-col cols="12" md="6" pa-3>
      <v-subheader>
        Som de notificação do chat
      </v-subheader>
      <v-slider
        v-model="sound.chat.volume"
        thumb-label
        min="0"
        max="100"
        :step="1"
        append-icon="volume_up"
        prepend-icon="volume_down"
      />
      <v-col cols="12" pa-3>
        <v-checkbox v-model="sound.chat.muted" :label="$t('mute')" />
        <v-btn class="primary white--text" @click="playChat()">
          {{ $t('test') }}
          <v-icon>
            play_arrow
          </v-icon>
        </v-btn>
      </v-col>
    </v-col>
    
    <v-col cols="12" md="6" pa-3>
      <v-subheader>
        Som de notificação geral
      </v-subheader>
      <v-slider
        v-model="sound.notification.volume"
        thumb-label
        min="0"
        max="100"
        :step="1"
        append-icon="volume_up"
        prepend-icon="volume_down"
      />
      <v-col cols="12" pa-3>
        <v-checkbox v-model="sound.notification.muted" :label="$t('mute')" />
        <v-btn class="primary white--text" @click="playNotification()">
          {{ $t('test') }}
          <v-icon>
            play_arrow
          </v-icon>
        </v-btn>
      </v-col>
    </v-col>
    <v-col cols="12" pa-3>
      <v-btn class="primary" @click="save()">
        {{ $t('save') }}
        <v-icon right>
          save
        </v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      audioChat: { volume: 0 },
      audioNotification: { volume: 0 },
      sound: {
        chat: {
          muted: true,
          volume: 0
        },
        notitifcation: {
          muted: false,
          volume: 0
        }
      }
    }
  },

  watch: {
    'sound.chat.volume': function(value) {
      this.audioChat.volume = value / 100
      this.$store.commit('sound/setChatVolume', value / 100)
    },
    'sound.notification.volume': function(value) {
      this.audioNotification.volume = value / 100
      this.$store.commit('sound/setNotificationVolume', value / 100)
    }
  },
  asyncData({ $axios }) {
    return $axios.post('/auth/user').then(response => {
      return {
        sound: response.data.user.sounds
      }
    })
  },
  mounted() {
    this.audioChat = new Audio('/sounds/open-ended.ogg')
    this.audioNotification = new Audio('/sounds/open-ended.ogg')
  },
  methods: {
    playChat() {
      this.audioChat.play()
    },
    playNotification() {
      this.audioNotification.play()
    },
    save() {
      this.$axios.put('/analyst/sound', this.sound).then(() => {
        this.$toast.show('Atualizado', {
          duration: 1000,
          icon: 'done'
        })
      })
    }
  }
}
</script>

<style>
</style>
