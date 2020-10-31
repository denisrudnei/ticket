<template>
  <v-row>
    <v-col
      cols="12"
      pa-3
    >
      <v-text-field
        v-model="role.name"
        label="Nome [não pode ser alterado]"
        filled
        :placeholder="$t('name')"
        readonly
      />
    </v-col>
    <v-col
      cols="12"
      pa-3
    >
      <v-text-field
        v-model="role.description"
        :label="$t('description')"
        filled
        placeholder="Descrição"
      />
    </v-col>
    <v-col
      cols="12"
      pa-3
    >
      <v-btn
        class="primary white--text"
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
import { mapGetters } from 'vuex';
import RoleById from '@/graphql/query/role/roleById';
import edit from '@/graphql/mutation/config/role/edit';

export default {
  asyncData({ app, params }) {
    return app.apolloProvider.defaultClient
      .query({
        query: RoleById,
        variables: {
          id: params.id,
        },
      })
      .then((response) => ({
        role: response.data.RoleById,
      }));
  },
  data() {
    return {
      role: null,
    };
  },
  computed: mapGetters({
    roles: 'role/getRoles',
  }),
  methods: {
    save() {
      this.$apollo
        .mutate({
          mutation: edit,
          variables: {
            roleId: this.role.id,
            role: {
              name: this.role.name,
              description: this.role.description,
            },
          },
        })
        .then(() => {
          this.$toast.show('Role ataualizada com sucesso', {
            duration: 1000,
            icon: 'verified_user',
          });
          this.$router.push('/config/permissions');
        });
    },
  },
};
</script>

<style></style>
