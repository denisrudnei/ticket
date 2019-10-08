<template>
  <category-create v-model="category" editing @input="update" />
</template>

<script>
import ggl from 'graphql-tag'
import CategoryCreate from '@/components/ticket/category/create'
import CategoryEdit from '@/graphql/query/config/category/edit.graphql'
export default {
  components: {
    CategoryCreate
  },
  asyncData({ params, app }) {
    const name = params.name
    return app.$apollo
      .query({
        query: ggl(CategoryEdit),
        variables: {
          name: name
        }
      })
      .then(response => {
        return {
          category: response.data.category
        }
      })
  },
  methods: {
    update(category) {
      this.$axios.put(`/category/${category._id}`, category).then(() => {
        this.$toast.show('Categoria atualizada', {
          duration: 5000,
          icon: 'done'
        })
        this.$router.push('/config/category')
      })
    }
  }
}
</script>

<style>
</style>
