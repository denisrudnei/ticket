<template>
  <category-create @input="save" />
</template>

<script>
import CategoryCreate from '@/components/ticket/category/create'
import ggl from 'graphql-tag'
import createCategory from '@/graphql/mutation/config/category/createCategory.graphql'
import categoryList from '@/graphql/query/config/category/categoryList.graphql'
export default {
  components: {
    CategoryCreate
  },
  methods: {
    save(category) {
      this.$apollo
        .mutate({
          mutation: ggl(createCategory),
          variables: {
            category: {
              name: category.name,
              description: category.description,
              defaultGroup: category.defaultGroup._id,
              defaultStatus: category.defaultStatus._id,
              defaultPriority: category.defaultPriority._id
            }
          },
          refetchQueries: [{ query: ggl(categoryList) }]
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
