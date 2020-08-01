<template>
  <v-menu :close-on-content-click="false" :nudge-width="250">
    <template v-slot:activator="{ on }">
      <v-btn text class="primary white--text" :title="$t('language')" v-on="on">
        <v-icon>
          language
        </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        {{ $t('language') }}
      </v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="item in locales"
            :key="item.value"
            @click="updateLanguage(item.value)"
          >
            {{ item.text }}
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: mapGetters({
    locales: 'locale/getLocales',
  }),
  methods: {
    updateLanguage(value) {
      localStorage.setItem('language', value);
      this.$store.commit('locale/setLocale', value);
      this.$i18n.locale = value;
    },
  },
};
</script>
