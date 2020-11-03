<template>
  <v-row>
    <v-col
      cols="11"
      pa-3
    >
      <v-card v-if="notification !== null">
        <v-card-title>
          {{ notification.content }}
        </v-card-title>
        <v-card-text>
          <h4>Emitido por: {{ notification.from.name }}</h4>
          <sub>{{ notification.date | date }}</sub>
          <h4>
            {{ notification | numberOfPeople }}
          </h4>
        </v-card-text>
        <v-card-actions>
          <v-switch
            :input-value="notification.read.map((user) => user.id.toString())"
            :value="user.id.toString()"
            label="Lido"
            @change="read()"
          />
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="1">
      <v-row>
        <v-btn
          outlined
          :disabled="!prev()"
          fab
          color="primary"
          icon
          @click="goTo(prev())"
        >
          <v-icon>
            keyboard_arrow_up
          </v-icon>
        </v-btn>
      </v-row>
      <br>
      <v-row>
        <v-btn
          outlined
          :disabled="!next()"
          fab
          color="primary"
          icon
          @click="goTo(next())"
        >
          <v-icon>
            keyboard_arrow_down
          </v-icon>
        </v-btn>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';
import readNotification from '@/mixins/readNotification';
import NotificationById from '@/graphql/query/notification/getNotification';

export default {
  filters: {
    numberOfPeople(notification) {
      const size = notification.to.length;
      if (size === 1) return 'Somente você recebeu essa notificação';
      if (size === 2) return 'Você e mais uma outra pessoa receberam essa notificação';
      return `${size} pessoas receberam a notificação`;
    },
  },
  mixins: [readNotification],
  data() {
    return {
      notification: null,
    };
  },
  computed: {
    ...mapGetters({
      user: 'auth/getUser',
      notifications: 'notification/getNotifications',
    }),
  },
  created() {
    this.getNotification();
  },
  methods: {
    getNotification(notificationId) {
      const id = notificationId !== undefined ? notificationId : this.$route.params.id;
      this.$apollo.query({
        query: NotificationById,
        variables: {
          id,
        },
      }).then((response) => {
        this.notification = response.data.NotificationById;
      });
    },
    prev() {
      if (this.notification === null) return false;
      const index = this.notifications
        .findIndex((ntf) => ntf.id === this.notification.id.toString());
      return this.notifications[index - 1];
    },
    next() {
      if (this.notification === null) return false;
      const index = this.notifications
        .findIndex((ntf) => ntf.id === this.notification.id.toString());

      return this.notifications[index + 1];
    },
    async goTo(notification) {
      this.$router.push(`/profile/notification/${notification.id}`);
      await this.getNotification(notification.id);
    },
    read() {
      this.readNotification(this.notification);
    },
  },
};
</script>

<style></style>
