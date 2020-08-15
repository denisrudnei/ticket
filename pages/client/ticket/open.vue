<template>
  <v-row>
    <v-col v-for="category in categories" :key="category.id" cols="12" md="4">
      <v-card tile>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col cols="12" md="4">
                  <nuxt-link
                    :to="`/client/ticket/category/${category.name}?id=${category.id}`"
                  >
                    <v-img
                      :src="getImage(category.id)"
                      :aspect-ratio="1"
                    />
                  </nuxt-link>
                </v-col>
                <v-col cols="12" md="8">
                  <nuxt-link
                    tag="span"
                    :to="`/client/ticket/category/${category.name}?id=${category.id}`"
                  >
                    <h4>
                      {{ category.fullName }}
                    </h4>
                  </nuxt-link>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              {{ category.description }}
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Grupo responsável"
                filled
                readonly
                :value="category.defaultGroup.name"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-if="category.defaultStatus"
                label="Status inicial"
                filled
                readonly
                :value="category.defaultStatus.name"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-if="category.defaultPriority"
                label="Prioridade"
                filled
                readonly
                :value="category.defaultPriority.name"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ggl from 'graphql-tag';
import categoryList from '@/graphql/query/client/ticket/categoryList.graphql';

export default {
  layout: 'client',
  asyncData({ app }) {
    return app.$apollo
      .query({
        query: ggl(categoryList),
      })
      .then((response) => ({
        categories: response.data.category,
      }));
  },
  methods: {
    getImage(categoryId) {
      const category = this.categories.find((item) => item.id === categoryId);
      if (category.file !== null) return category.file.url;
      return 'https://picsum.photos/200/300';
    },
  },
};
</script>

<style></style>
