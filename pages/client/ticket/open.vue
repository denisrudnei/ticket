<template>
  <v-row>
    <v-col v-for="category in categories" :key="category._id" cols="12" md="4">
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="4">
              <nuxt-link :to="`/client/ticket/category/${category.name}?_id=${category._id}`">
                <v-img :src="`https://picsum.photos/200/300?url=${Math.random()}`" :aspect-ratio="1" />
              </nuxt-link>
            </v-col>
            <v-col cols="8">
              <nuxt-link tag="span" :to="`/client/ticket/category/${category.name}?_id=${category._id}`">
                <h4>
                  {{ category.fullName }}
                </h4>
              </nuxt-link>
              <v-list-item tile block :to="`/client/ticket/category/${category.name}?_id=${category._id}`">
                {{ category.description }}
              </v-list-item>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: 'client',
  asyncData({ $axios }) {
    return $axios.get('/category').then(response => {
      return {
        categories: response.data
      }
    })
  }
}
</script>

<style>
</style>
