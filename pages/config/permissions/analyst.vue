<template>
  <v-row>
    <v-col
      cols="12"
      pa-3
    >
      <v-data-table
        :items="
          analysts.filter((a) => {
            return a.id !== user.id
          })
        "
        :headers="headers"
      >
        <template #item.name="{ item }">
          {{ item.name }}
        </template>
        <template #item.role="{ item }">
          {{ item.role.name }}
        </template>
        <template #item.actions="{ item }">
          <v-menu :close-on-content-click="false">
            <template #activator="{ on }">
              <v-btn
                class="primary white--text"
                icon
                v-on="on"
              >
                <v-icon>
                  edit
                </v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-text>
                <v-row>
                  <v-col
                    cols="12"
                    pa-3
                  >
                    <v-select
                      v-model="selected"
                      filled
                      :items="
                        roles.map((r) => {
                          return { text: r.name, value: r }
                        })
                      "
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    pa-3
                  >
                    <v-btn
                      class="primary white--text"
                      icon
                      @click="updateRole(item.id)"
                    >
                      <v-icon>
                        save
                      </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-menu>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import list from '@/graphql/query/config/role/list';
import UpdateRole from '@/graphql/mutation/config/permissions/edit';

export default {
  asyncData({ app }) {
    return app.apolloProvider.defaultClient
      .query({
        query: list,
      })
      .then((response) => ({
        analysts: response.data.analyst,
        roles: response.data.role,
      }));
  },
  data() {
    return {
      selected: '',
    };
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t('name'),
          value: 'name',
        },
        {
          text: this.$t('role'),
          value: 'role',
        },
        {
          text: this.$t('actions'),
          value: 'actions',
        },
      ];
    },
    user() {
      return this.$auth.user;
    },
  },
  methods: {
    updateRole(analystId) {
      this.$apollo
        .mutate({
          mutation: UpdateRole,
          variables: {
            userId: analystId,
            roleId: this.selected.id,
          },
        })
        .then((result) => {
          this.analysts.find((user) => user.id === analystId).role = this.selected;
          this.$toast.show('Alterado', {
            duration: 1000,
            icon: 'verified_user',
          });
        });
    },
  },
};
</script>

<style></style>
