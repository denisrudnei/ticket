<template>
  <v-dialog v-model="show">
    <v-card>
      <v-card-title>
        Hotkeys
      </v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="(hotkey, index) in hotkeys" :key="index">
            {{ $t(hotkey) }}
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    show: {
      get() {
        return this.$store.getters['hotkeys/getShow'];
      },
      set(value) {
        this.$store.commit('hotkeys/setShow', value);
      },
    },
    ...mapGetters({
      hotkeys: 'hotkeys/getHotkeys',
    }),
  },
  mounted() {},
};
</script>

<style></style>
