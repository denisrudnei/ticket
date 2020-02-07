<template>
  <category-create @input="save" />
</template>

<script>
import CategoryCreate from '@/components/ticket/category/create'
import ggl from 'graphql-tag'
import updateCategory from '@/graphql/mutation/config/category/editCategory.graphql'
import categoryEdit from '@/graphql/query/config/category/edit.graphql'
export default {
  components: {
    CategoryCreate
  },
  methods: {
    save(category) {
      this.$apollo
        .mutate({
          mutation: ggl(updateCategory),
          variables: {
            categoryId: category._id,
            category: category
          },
          refetchQueries: [{ query: ggl(categoryEdit) }]
        })
        .then(() => {
          this.$toast.show('Categoria criada', {
            duration: 1000
          })
          this.$router.push('/config/category')
        })
    }
  }
}
</script>

<style>
</style>
