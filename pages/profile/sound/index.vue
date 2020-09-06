<template>
  <v-row>
    <v-col
      v-for="sound in sounds"
      :key="sound.id"
      cols="12"
      md="6"
      pa-3
    >
      <v-subheader>
        <!-- Som de notificação do chat -->
        {{ sound.type }}
      </v-subheader>
      <v-slider
        v-model="sound.volume"
        thumb-label
        min="0"
        max="100"
        :step="1"
        append-icon="volume_up"
        prepend-icon="volume_down"
        @input="changeVolume(sound.type, sound.volume)"
      />
      <v-col
        cols="12"
        pa-3
      >
        <v-checkbox
          v-model="sound.muted"
          :label="$t('mute')"
        />
        <v-btn
          class="primary white--text"
          @click="play(sound.type)"
        >
          {{ $t('test') }}
          <v-icon>
            play_arrow
          </v-icon>
        </v-btn>
      </v-col>
    </v-col>
    <v-col
      cols="12"
      pa-3
    >
      <v-btn
        class="primary"
        @click="save()"
      >
        {{ $t('save') }}
        <v-icon right>
          save
        </v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import sound from '@/graphql/mutation/profile/sound';
import list from '@/graphql/query/profile/sound';

export default {
  asyncData({ app }) {
    return app.$apollo
      .query({
        query: list,
      })
      .then((response) => ({
        sounds: response.data.GetSounds,
        types: response.data.soundTypes,
      }));
  },
  data() {
    return {
      types: [],
      audio: {
        CHAT: { volume: 0 },
        NOTIFICATION: { volume: 0 },
      },
    };
  },
  mounted() {
    this.sounds = this.types.map((type) => {
      const exist = this.sounds.find((s) => s.type === type[0]);
      if (exist) return exist;
      return {
        type: type[0],
        volume: 0,
        muted: false,
      };
    });
    this.audio.CHAT = new Audio('/sounds/open-ended.ogg');
    this.audio.NOTIFICATION = new Audio('/sounds/open-ended.ogg');
  },
  methods: {
    changeVolume(type, value) {
      this.audio[type].volume = value / 100;
      this.$store.commit('sound/setChatVolume', value / 100);
    },
    play(type) {
      this.audio[type].play();
    },
    save() {
      this.$apollo
        .mutate({
          mutation: sound,
          variables: {
            config: this.sounds.map((value) => {
              const { volume, muted, type } = value;
              return {
                volume,
                muted,
                type,
              };
            }),
          },
        })
        .then(() => {
          this.$toast.show(this.$t('updated'), {
            duration: 1000,
            icon: 'done',
          });
        });
    },
  },
};
</script>

<style></style>
