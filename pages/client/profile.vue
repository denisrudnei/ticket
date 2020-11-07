<template>
  <v-row>
    <v-col coll="12">
      <v-row>
        <v-col
          cols="12"
          sm="4"
          md="2"
        >
          <v-avatar
            width="100%"
            height="auto"
          >
            <v-img
              ref="picture"
              :src="user.picture"
              alt=""
            />
          </v-avatar>
        </v-col>
        <v-col
          cols="12"
          sm="8"
          md="10"
        >
          <v-text-field
            v-model="user.name"
            filled
            :label="$t('name')"
          />
          <v-autocomplete
            v-model="user.address"
            filled
            label="Local"
            :value-comparator="compare"
            :items="
              addresses.map((a) => {
                return { text: a.name, value: a }
              })
            "
          />
          <v-file-input
            v-model="image"
            filled
            label="Trocar imagem"
            @change="changeImage"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12">
      <v-btn
        class="primary white--text"
        @click="save"
      >
        <v-icon left>
          save
        </v-icon>
        {{ $t('save') }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';

import list from '@/graphql/query/client/profile/list';
import compareObjectsWithId from '@/mixins/compareObjectsWithId';
import edit from '@/graphql/mutation/client/profile/edit';

export default {
  mixins: [compareObjectsWithId],
  layout: 'client',
  asyncData({ app }) {
    return app.apolloProvider.defaultClient
      .query({
        query: list,
      })
      .then((response) => ({
        addresses: response.data.address,
        user: response.data.user,
      }));
  },
  data() {
    return {
      image: null,
    };
  },
  methods: {
    changeImage(value) {
      const fileReader = new FileReader();
      fileReader.addEventListener('loadend', () => {
        this.$refs.picture.src = fileReader.result;
      });
      fileReader.readAsDataURL(value);
    },
    save() {
      const toSave = {
        address: this.user.address.id,
        name: this.user.name,
      };
      this.$apollo.mutate({
        mutation: edit,
        variables: {
          analyst: toSave,
        },
      }).then(() => {
        this.$toast.show('Analyst updated', {
          duration: 5000,
          icon: 'done',
        });
      }).catch(() => {
        this.$toast.error('Failed to update', {
          duration: 5000,
          icon: 'error',
        });
      });
    },
  },
};
</script>

<style></style>
