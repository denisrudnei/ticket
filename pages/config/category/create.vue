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
              defaultGroup: category.defaultGroup.id,
              defaultStatus: category.defaultStatus.id,
              defaultPriority: category.defaultPriority.id
            }
          },
          refetchQueries: [{ query: ggl(categoryList) }]
        })
        .then(() => {
          this.$toast.show('Categoria criada', {
            duration: 1000
          })
          if (category.image) {
            const formData = new FormData()
            formData.append('image', category.iamge)
            this.$axios
              .post(`/config/category/image/${category.id}`, formData)
              .then(() => {
                this.$toast.show('Image uploaded', {
                  duration: 5000,
                  icon: 'done'
                })
              })
          }
          this.$router.push('/config/category')
        })
    }
  }
}
</script>

<style>
</style>
