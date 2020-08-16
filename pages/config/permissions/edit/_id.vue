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
import RoleById from '@/graphql/query/role/roleById.graphql';
import edit from '@/graphql/mutation/config/role/edit.graphql';
import ggl from 'graphql-tag';

export default {
  data() {
    return {
      role: null,
    };
  },
  computed: mapGetters({
    roles: 'role/getRoles',
  }),
  asyncData({ app, params }) {
    return app.$apollo
      .query({
        query: ggl(RoleById),
        variables: {
          id: params.id,
        },
      })
      .then((response) => ({
        role: response.data.RoleById,
      }));
  },
  methods: {
    save() {
      this.$apollo
        .mutate({
          mutation: ggl(edit),
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
