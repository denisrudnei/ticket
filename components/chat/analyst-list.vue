<template>
  <v-navigation-drawer
    app
    right
    clipped
    :mini-variant="mini"
  >
    <v-list two-line>
      <v-list-item @click="mini = !mini">
        <v-list-item-action>
          <v-btn
            icon
            class="primary white--text"
          >
            <v-icon>chat</v-icon>
          </v-btn>
        </v-list-item-action>
        <v-list-item-content>
          Ocultar o chat
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-action>
          <v-menu
            left
            :close-on-content-click="false"
            :nudge-width="350"
          >
            <template #activator="{ on }">
              <v-btn
                icon
                class="primary white--text"
                v-on="on"
              >
                <v-icon>search</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-text-field
                v-model="searchAnalyst"
                filled
                label="Buscar analista"
              />
            </v-card>
          </v-menu>
        </v-list-item-action>
        <v-list-item-content>
          Buscar
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-action>
          <v-menu
            left
            :close-on-content-click="false"
            :nudge-width="350"
          >
            <template #activator="{ on }">
              <v-btn
                icon
                class="primary white--text"
                v-on="on"
              >
                <v-icon>build</v-icon>
              </v-btn>
            </template>
            <analyst-status />
          </v-menu>
        </v-list-item-action>
        <v-list-item-content>
          Alterar status
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        v-for="analyst in analysts"
        v-show="!mini"
        :key="analyst.id"
        @click="openChat(analyst)"
      >
        <v-list-item-action>
          <v-badge
            overlap
            :color="getStatus(analyst.status)"
            class="white--text"
          >
            <template #badge>
              <v-icon class="white--text">
                chat
              </v-icon>
            </template>
            <v-avatar>
              <v-img :src="analyst.picture" />
            </v-avatar>
          </v-badge>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>
            {{ analyst.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ analyst.email }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex';

import analystList from '@/graphql/query/chat/analyst-list';
import changeStatus from '@/graphql/subscription/chat/changeStatus';
import AnalystStatus from './status';

export default {
  components: {
    AnalystStatus,
  },
  apollo: {
    $subscribe: {
      changeStatus: {
        query: changeStatus,
        result({ data }) {
          this.updateAnalystStatus(data.ChangeAnalystStatus);
        },
      },
    },
  },
  data() {
    return {
      mini: true,
      showModal: false,
      searchAnalyst: '',
    };
  },
  computed: {
    ...mapGetters({
      user: 'auth/getUser',
      chats: 'chat/getChats',
      colors: 'chat/getColors',
    }),
    analysts() {
      return this.$store.getters['analyst/getAnalysts']
        .filter((analyst) => analyst.id !== this.user.id)
        .filter((analyst) => analyst.name
          .toLowerCase()
          .includes(this.searchAnalyst.toLowerCase()));
    },
  },
  created() {
    this.$apollo
      .query({
        query: analystList,
      })
      .then((response) => {
        this.$store.commit('analyst/setAnalysts', response.data.analyst);
        this.$store.commit('chat/setChats', response.data.chat);
        const colors = response.data.colors.map((color) => ({
          status: color[0],
          color: color[1],
        }));
        this.$store.commit('chat/setColors', colors);
      });
  },
  methods: {
    openChat(analyst) {
      this.$store.dispatch('chat/getOneChat', analyst.id);
    },
    getStatus(status) {
      const result = this.colors.find((s) => s.status === status);
      if (result) return result.color;
      return 'black';
    },
    updateAnalystStatus(analyst) {
      const analystToUpdate = this.analysts.find((a) => a.id === analyst.id);
      if (!analystToUpdate) return;
      analystToUpdate.status = analyst.status;
      this.$store.commit('analyst/setAnalysts', [
        ...this.analysts.filter((a) => a.id !== analyst.id),
        analystToUpdate,
      ]);
    },
    viewRecents(id) {
      this.showModal = true;
      this.$router.push({
        query: {
          openedBy: id,
        },
      });
    },
  },
};
</script>

<style></style>
